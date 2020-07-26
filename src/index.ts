// TODO remove express from dependencies
// TODO move ws from dependencies to peer dependencies
import express from 'express';
import http from 'http';
import url from 'url';

import * as WebSocket from 'ws';
import { register, param } from './lib/decorators';
import { WebSocketServer } from './lib/websocket-server';
import JSONRPC2MessageHandler from './lib/jsonrpc2-message-handler/message-handler';
import SimpleMessageHandler from './lib/simple-message-handler/message-handler';
import { MessageHandler } from './lib/message-handler';

const app = express();
const server = http.createServer(app);

class RPCNamespaceA extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
        console.log('namespace a methods: ', this._namespaceMethods);
    }
    @register('blabla')
    sum(@param('a') a: any, @param('b') b: string | number) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }
}

class RPCNamespaceB extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
        console.log('namespace b methods: ', this.getMethods());
    }
    @register()
    sum(@param('a') a: number, @param('b') b: string) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }
}

const a = new RPCNamespaceA(new SimpleMessageHandler(), { noServer: true });
const b = new RPCNamespaceB(new JSONRPC2MessageHandler(), { noServer: true });

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
