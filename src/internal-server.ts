/*
This file runs on a port that's not exposed outside of the firewall.

This can be used to expose things like metrics to prometheus.
 */
import express from 'express';
import {register} from './metrics';
import jwt from 'jsonwebtoken';
import {httpLogger, remoteTransport} from './util/logger';

const app = express();

//serve metrics to prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(
        await register.metrics()
    );
});

app.use((req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
        jwt.verify(token, process.env.INTERNAL_JWT_SECRET);
        next();
    }
    catch(e) {
        httpLogger.warn(`Not Authorized: ${req.url}`, {
            status: 401,
            internal: true,
            url: req.url
        });
        res.status(401);
        res.send('Not Authorized');
    }
});

app.get('/logs', (req, res) => {
    res.json(
        remoteTransport.flushBuffer()
    );
});

app.use((req, res) => {
    res.status(404);
    res.send('Not Found');
})

app.listen(4001);
