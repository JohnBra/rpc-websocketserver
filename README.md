# rpc-websocketserver - A Node.js library
A simple and extensively documented typescript focused lib, to implement/prototype rpc websocket server applications with convenient decorators.

Wraps the popular [ws](https://github.com/websockets/ws) lib.

**Note**: This is a backend focused library and does therefore not work in the browser.

## Table of contents

## Installing
With yarn (incl. peer dependencies)
```bash
yarn add rpc-websocketserver ws
```
With npm (incl. peer dependencies)
```
npm install rpc-websocketserver ws
```
Add experimental decorators and emit metadata to your `tsconfig.json`
```json
// tsconfig.json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  ...
}
```
## Perks, limitations and future prospects
### This lib offers the following out of the box:
* Extensive documentation for ease of development
* RPC namespace creation
* [JSON RPC 2](https://www.jsonrpc.org/specification) conform message handler
* Simple message handler
* Easily readable and maintainable registration of namespace methods with decorators
* Convenience method to broadcast messages to clients
* Defined interfaces to implement your own custom message handlers
* Retains all functionality of the [ws](https://github.com/websockets/ws) lib

### This lib does **NOT** offer the following:
* Batch request handling
* Parameter typechecking of rpc methods

### Possible features to be added in the future:
* [Swagger](https://swagger.io/) like documentation generation with [OpenRPC](https://open-rpc.org/) as model
* Protected methods (require authentication before calling rpc)

## Usage example

### Create namespaces for your rpc
```typescript
import { WebSocketServer, register, param } from 'rpc-websocketserver';

// inherit from WebSocketServer
class NamespaceA extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
       super(messageHandler, options);
    }
    
    @register()     // use the '@register' decorator to add function to the registered namespace methods
    sum(@param('a') a: number, @param('b') b: number) { // use the '@param' decorator to expose parameters
       return a + b;
    }

    @register('bar')     // optional: register a function with a specific name instead of the function name
    foo(@param('a') a: number, @param('b') b: number) { // use the '@param' decorator to expose parameters
       return a + b;
    }
}

// inherit from WebSocketServer
class NamespaceB extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
       super(messageHandler, options);
    }
    
    @register()     // use the '@register' decorator to add function to the registered namespace methods
    substract(@param('a') a: number, @param('b') b: number) { // use the '@param' decorator to expose parameters
       return a - b;
    }

    @register('foo')     // optional: register a function with a specific name instead of the function name
    bar(@param('a') a: number, @param('b') b: number) { // use the '@param' decorator to expose parameters
       return a - b;
    }
}
```

### Server
Set up your ws server similar to the way you would in the [ws example](https://github.com/websockets/ws/blob/master/README.md#multiple-servers-sharing-a-single-https-server) and add your own namespaces
```typescript
import express from 'express';
import http from 'http';
import url from 'url';

import { JSONRPC2MessageHandler } from 'rpc-websocketserver';
import { SimpleMessageHandler } from 'rpc-websocketserver';

const app = express();
const server = http.createServer(app);

// pass message handler instances and WebSocket.ServerOptions to the respective namespaces
const namespaceA = new RPCNamespaceA(new SimpleMessageHandler(), { noServer: true });
const namespaceB = new RPCNamespaceB(new JSONRPC2MessageHandler(), { noServer: true });


server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = url.parse(request.url);

    if (pathname === '/a') {
        namespaceA.wss.handleUpgrade(request, socket, head, function done(ws: any) {
            namespaceA.wss.emit('connection', ws, request);
        });
    } else if (pathname === '/b') {
        namespaceB.wss.handleUpgrade(request, socket, head, function done(ws: any) {
            namespaceB.wss.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(10001, '0.0.0.0', 1024, () => {
    console.log(`Listening for connections on 10001...`);
});
```

That's it!

## Contributing
Feel free to give feedback through issues or open pull requests with improvements.

## License
[MIT](https://github.com/JohnBra/rpc-websocketserver/blob/master/LICENSE)
