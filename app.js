require('dotenv').config();
const express = require('express'),
    path = require('path'),
    http = require('http'),
    logger = require('morgan'),
    app = express(),
    server = http.createServer(app),
    wss = new (require('ws')).Server({server}),
    createError = require('http-errors'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    {redisClient} = require('./util/redis'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);

app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path, stat) => {
        if (
            //don't cache the userscript path, it doesn't use manifest generated content paths
            !path.includes('.user.js') &&
            //don't give the base favicon image a long cache time, because it's not easily cache busted for the userscript.
            //instead we'll just depend on the default etag behavior
            !path.includes('favicon.png')
        ) {
            res.set('Cache-Control', 'max-age=3153600');
        }
    }
}));
app.use(bodyParser.json());

const sessionStore = new RedisStore({client: redisClient});
app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    httpOnly: true,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
require('./util/server-socket').initialize(wss, sessionStore);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

server.listen(4000, () => {
    console.log(`Context.Reviews server started!`)
});
