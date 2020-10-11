/*
This file runs on a port that's not exposed outside of the docker
compose network and isn't reachable from outside the firewall.

This can be used to expose things like metrics to prometheus.
 */
import express from 'express';
import {register} from './metrics';

const app = express();

//serve metrics to prometheus
app.get('/metrics', async (req, res) => {
    res.send(
        await register.metrics()
    );
})

app.listen(4001);
