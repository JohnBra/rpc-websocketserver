import express from 'express';
import http from 'http';
import url from 'url';

import WebSocket from 'ws';
import { register, param } from './lib/decorators';
import { WebSocketServer } from './lib/websocket-server';
import { JSONRPC2MessageHandler } from './lib/jsonrpc2/json-rpc-2-message-handler';
import { SimpleMessageHandler } from './lib/simple/simple-message-handler';

const app = express();
const server = http.createServer(app);

class RPCWebsocketServer extends WebSocketServer {
    constructor(options: WebSocket.ServerOptions) {
        super(options);
    }
    @register('blabla')
    sum(@param('a') a: number, @param('b') b: string) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }
}

const s = new RPCWebsocketServer({ noServer: true });
s.setMessageHandler(new SimpleMessageHandler());

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);

    if (pathname === '/test') {
        s.wss.handleUpgrade(request, socket, head, function done(ws: any) {
            s.wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(10001, '0.0.0.0', 1024, () => {
    console.log(`Listening for connections on 10001...`);
});
