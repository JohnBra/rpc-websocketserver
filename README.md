# rpc-websocketserver - A Node.js library
[![Version npm](https://img.shields.io/npm/v/rpc-websocketserver.svg?logo=npm)](https://www.npmjs.com/package/rpc-websocketserver)
![build](https://github.com/JohnBra/rpc-websocketserver/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/JohnBra/rpc-websocketserver/badge.svg?branch=master)](https://coveralls.io/github/JohnBra/rpc-websocketserver?branch=master)

A simple and extensively documented typescript focused lib, to implement/prototype rpc websocket server applications with convenient decorators.

Wraps the popular [ws](https://github.com/websockets/ws) lib.

**Note**: This is a backend focused library and therefore does not work in the browser.

## Table of contents
- [Installing](#installing)
- [Features, limitations and possible features to be added](#features-limitations-and-possible-features-to-be-added)
    - [Features](#this-lib-offers-the-following-out-of-the-box)
    - [Limitations](#this-lib-does-not-offer-the-following)
    - [Possible features](#possible-features-to-be-added-in-the-future)
- [Usage examples](#usage-examples)
    - [Create namespaces for your rpc](#create-namespaces-for-your-rpc)
    - [Server](#server)
    - [Sending messages to the server](#sending-messages-to-the-server)
    - [Reimplementing provided WebSocketServer functionality](#reimplementing-provided-websocketserver-functionality)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

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
## Features, limitations and possible features to be added
### This lib offers the following out of the box:
- Extensive documentation for ease of development
- Retains all functionality of the [ws](https://github.com/websockets/ws) lib
- RPC namespace creation
- [JSON RPC 2](https://www.jsonrpc.org/specification) conform message handler (incl. errors, responses and the like)
- Simple message handler (super simplistic message handler)
- Easily readable and maintainable registration of namespace methods with decorators
- Convenience methods to interact with clients (e.g. broadcast messages to all clients). *You are also able to reimplement all ws listeners and convenience methods if you wish*
- Defined interfaces to implement your own custom message handlers

### This lib does **NOT** offer the following:
- Batch request handling
- Runtime parameter typechecking on remote procedure call

### Possible features to be added in the future:
- [Swagger](https://swagger.io/) like documentation generation with [OpenRPC](https://open-rpc.org/) as model
- Protected methods (require authentication before calling rpc)

## Usage examples

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
Set up your ws server similar like you would in the [ws example](https://github.com/websockets/ws/blob/master/README.md#multiple-servers-sharing-a-single-https-server) and add your own namespaces
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
// use different message handlers for different namespaces
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

That's it for the server!

### Sending messages to the server
Once you have started the server, you can start firing away messages to the implemented endpoints. Provided the example code above, we have two endpoints:
- ws://localhost:10001/a (SimpleMessageHandler)
- ws://localhost:10001/b (JSONRPC2MessageHandler)

Once you have connected to the endpoint with the **SimpleMessageHandler** you have to adhere to the defined message format:
- Incoming messages must be of type string or Buffer
- After reading the string or Buffer, the RPC must be an object
- The object must have the "method" field with a value of type string
- The object can have the "params" key. It may also be omitted.

Valid remote procedure calls for the SimpleMessageHandler

Positional parameters:
```json
{
  "method": "sum",
  "params": [1, 2]
}
```
Named parameters:
```json
{
  "method": "sum",
  "params": { "b": 2, "a": 1 }
}
```
Omitted parameters:
```json
{
  "method": "doSomething"
}
```

### Reimplementing provided WebSocketServer functionality
Currently, the [WebSocketServer](https://github.com/JohnBra/rpc-websocketserver/blob/master/src/lib/websocket-server.ts#L21) offers the following functionality out of the box:
- **Public** function to **retrieve all registered methods** for the specific namespace
- **Public** function to **broadcast a message** to all clients of this namespace
- **Protected** function to **send a message** to a specific client
- **Protected** function to **set ws listeners** once a connection was established
- **Protected** function to **handle received messages**

All protected functions can be reimplemented for your specific namespaces. You are encouraged to reimplement the 'onConnection' handler with handlers for the possible [ws events](https://github.com/websockets/ws/blob/master/doc/ws.md#event-close-1) (e. g. error) like so:
```typescript
import { WebSocketServer, register, param } from 'rpc-websocketserver';

// inherit from WebSocketServer
class NamespaceA extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
       super(messageHandler, options);
    }

    @register()
    sum(@param('a') a: number, @param('b') b: number) {
       return a + b;
    }

    // reimplementation of the onConnection handler to add more event listeners once a connection is established
    protected _onConnection(ws: WebSocket): void {
        super._onConnection(ws);
        ws.addListener('error', (err: Error) => console.log(err));
    }
}
```

This inheritance based approach should facilitate your own implementation for custom error/message handling, logging, clean up functionality on close events and so on.

## Changelog
[Changelog](https://github.com/JohnBra/rpc-websocketserver/blob/master/CHANGELOG.md)

## Contributing
Feel free to give feedback through issues or open pull requests with improvements.

## License
[MIT](https://github.com/JohnBra/rpc-websocketserver/blob/master/LICENSE)
