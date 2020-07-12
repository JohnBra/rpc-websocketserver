import express from 'express';
import http from 'http';
import url from 'url';

import * as WebSocket from 'ws';
import { register, param } from './lib/decorators';
import { WebSocketServer } from './lib/websocket-server';
import JSONRPC2MessageHandler from './lib/jsonrpc2/message-handler';
import SimpleMessageHandler from './lib/simple/message-handler';

const app = express();
const server = http.createServer(app);

class RPCNamespaceA extends WebSocketServer {
    constructor(options: WebSocket.ServerOptions) {
        super(options);
        console.log('namespace a methods: ', this._namespaceMethods);
    }
    @register('blabla')
    sum(@param('a') a: number, @param('b') b: string) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }
}

class RPCNamespaceB extends WebSocketServer {
    constructor(options: WebSocket.ServerOptions) {
        super(options);
        console.log('namespace b methods: ', this._namespaceMethods);
    }
    @register()
    sum(@param('a') a: number, @param('b') b: string) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }
}

const a = new RPCNamespaceA({ noServer: true });
const b = new RPCNamespaceB({ noServer: true });
a.setMessageHandler(new SimpleMessageHandler());
b.setMessageHandler(new JSONRPC2MessageHandler());

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);

    if (pathname === '/a') {
        a.wss.handleUpgrade(request, socket, head, function done(ws: any) {
            a.wss.emit('connection', ws, request);
        });
    } else if (pathname === '/b') {
        b.wss.handleUpgrade(request, socket, head, function done(ws: any) {
            b.wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(10001, '0.0.0.0', 1024, () => {
    console.log(`Listening for connections on 10001...`);
});
