import './env.js';
import { notFoundServed } from './metrics.js';
import express, { Request } from 'express';
import path from 'path';
import http from 'http';
import { appLogger } from './util/logger.js';
import { WebSocketServer } from 'ws';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { redisClient } from './util/redis-utils.js';
import session from 'express-session';
import { errorHandler } from './middleware/error-handler.js';
import bodyParser from 'body-parser';
import { requestId } from './middleware/request-id.js';
import { Prisma } from '@prisma/client';
import { prisma } from './util/prisma.js';
import { initialize as initializeServerSocket } from './util/server-socket.js';
import connectRedis from 'connect-redis';

import './internal-server.js';

export type UserWithSettings = Prisma.UserGetPayload<{
	include: {
		settings: true;
	};
}>;

export interface AppRequest extends Request {
	requestId: string;
	user: UserWithSettings;
}

const app = express(),
	server = http.createServer(app),
	wss = new WebSocketServer({ server }),
	RedisStore = connectRedis(session);

app.set('trust proxy', 1);
app.use(requestId);

app.disable('x-powered-by');
// view engine setup
app.set('views', path.resolve('src/server/views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/health', (req, res) => {
	res.send();
});

const sessionStore = new RedisStore({ client: redisClient });
app.use(
	session({
		store: sessionStore,
		name: 'context.reviews-sid',
		secret: process.env.SESSION_SECRET,
		cookie: {
			httpOnly: true,
			maxAge: 1000 * 60 * 60 * 24 * 31, // 31 days
		},
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
initializeServerSocket(wss, sessionStore);

app.use(function (req, res, next) {
	notFoundServed.inc();

	next({
		status: 404,
	});
});

app.use(errorHandler(false));

server.listen(4000, () => {
	appLogger.info(`Context.Reviews server started!`);
});

process.on('unhandledRejection', (error) => {
	appLogger.error(`Unhandled rejection`, {
		error,
	});
});

process.on('uncaughtException', async (error) => {
	console.error('Unhandled Exception!', error);
	await prisma.$disconnect();

	process.exit(1);
});
