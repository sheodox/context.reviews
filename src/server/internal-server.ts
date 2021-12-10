/*
This file runs on a port that's not exposed outside of the firewall.

This can be used to expose things like metrics to prometheus.
 */
import express from 'express';
import { register } from './metrics.js';
import jwt from 'jsonwebtoken';
import { remoteTransport } from './util/logger.js';
import { errorHandler } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';

const app = express();
app.use(requestId);

//serve metrics to prometheus
app.get('/metrics', async (req, res) => {
	res.set('Content-Type', 'text/plain');
	res.send(await register.metrics());
});

app.use((req, res, next) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	try {
		jwt.verify(token, process.env.INTERNAL_JWT_SECRET);
		next();
	} catch (e) {
		next({ status: 401 });
	}
});

app.get('/logs', (req, res) => {
	res.json(remoteTransport.flushBuffer());
});

app.use((req, res, next) => {
	next({ status: 404 });
});
app.use(errorHandler(true));

app.listen(4001);
