import express from 'express';
import http from 'http';
import url from 'url';

import WebSocket from 'ws';
import { register, param } from './lib/decorators';
import { WebSocketServer } from './lib/websocket-server';
import { JSONRPC2MessageHandler } from './lib/jsonrpc2/json-rpc-2-message-handler';

const app = express();
const server = http.createServer(app);

class RPCWebsocketServer extends WebSocketServer {
    constructor(options: WebSocket.ServerOptions) {
        super(options);
        console.log(this._namespaceMethods);
    }

    @register()
    sum(@param('a') a: number, @param('b') b: string) {
        console.log(`adding a ${a} and b ${b}`);
        return a + b;
    }

    // protected _onConnection(ws: WebSocket) {
    //     console.log('reimplemented on connection handler');
    //     ws.on('message', (message: string) => console.log(`received message on reimplemented ws: ${message}`));
    // }
}

// class Second extends WebSocketServer {
//     @register()
//     abc() {
//         console.log(`abc: this should work as well`);
//     }
//
//     @register()
//     async cde(
//         @param("errorMessage") errorMessage: string,
//         @param("test") t: number
//     ) {
//         console.log(`cde errorMessage: ${errorMessage}`);
//         console.log(`cde t: ${t}`);
//     }
// }
// console.log("second methods: ", second.getMethods());
// second.callMethod("cde", {test: 0, errorMessage: "hi"});
// second.callMethod("abc", {});
// second.callMethod("cde", ["hi", 0]);

const s = new RPCWebsocketServer({ noServer: true });
s.setMessageHandler(new JSONRPC2MessageHandler());

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
