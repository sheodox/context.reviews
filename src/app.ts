require('dotenv').config();
import express from 'express';
import path from 'path';
import http from 'http';
import logger from 'morgan';
import {Server} from 'ws';
import createError from 'http-errors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {redisClient} from './util/redis-utils';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express(),
    server = http.createServer(app),
    wss = new Server({server}),
    RedisStore = require('connect-redis')(session);

app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

const sessionStore = new RedisStore({client: redisClient});
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import statsRouter from './routes/stats';
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/stats', statsRouter);
require('./util/server-socket').initialize(wss, sessionStore);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

server.listen(4000, () => {
    console.log(`Context.Reviews server started!`)
});
