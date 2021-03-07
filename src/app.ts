require('dotenv').config();
import {notFoundServed} from "./metrics";
import express, {Request} from 'express';
import path from 'path';
import http from 'http';
import morgan from 'morgan';
import {appLogger} from './util/logger';
import {Server} from 'ws';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {redisClient} from './util/redis-utils';
import session from 'express-session';
import {errorHandler} from "./middleware/error-handler";
import bodyParser from 'body-parser';
import {requestId} from "./middleware/request-id";
import {Prisma} from '@prisma/client';
import {prisma} from "./util/prisma";

import './internal-server';

export type UserWithSettings = Prisma.UserGetPayload<{
    include: {
        settings: true
    }
}>

export interface AppRequest extends Request {
    requestId: string
    user: UserWithSettings
}

const app = express(),
    server = http.createServer(app),
    wss = new Server({server}),
    RedisStore = require('connect-redis')(session);

app.set('trust proxy', 1);
app.use(requestId);

app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

const sessionStore = new RedisStore({client: redisClient});
app.use(session({
    store: sessionStore,
    name: 'context.reviews-sid',
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 31, // 31 days
    },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import userRouter from './routes/user';
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
require('./util/server-socket').initialize(wss, sessionStore);

app.use(function(req, res, next) {
    notFoundServed.inc();

    next({
        status: 404
    });
});

app.use(errorHandler(false));

server.listen(4000, () => {
    appLogger.info(`Context.Reviews server started!`);
});

process.on('unhandledRejection', (error) => {
    appLogger.error(`Unhandled rejection`, {
        error
    });
});

process.on('uncaughtException', async error => {
    console.error('Unhandled Exception!', error);
    await prisma.$disconnect();

    process.exit(1);
})