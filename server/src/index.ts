import http from 'http';
import express from 'express';
import { initWsServer } from './webSockets'

const PORT = 8080;

const app = express();

const HTTPserver = app.listen(PORT, () => {
    console.log('Server is listening on port 8080');
});

initWsServer(HTTPserver);

