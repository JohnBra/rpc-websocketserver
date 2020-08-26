import WebSocket from 'ws';
import { WebSocketServer } from '../lib/websocket-server';
import { HandlerResult, MessageHandler, Method } from '../lib/interfaces';
import { NOOP } from '../lib/constants';
import { register } from '../lib/decorators';

import express from 'express';
import http from 'http';
import url from 'url';
import mock = jest.mock;

async function sleep(ms: number): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(() => resolve(), ms);
    });
}

class MockClient {
    ws: WebSocket;
    messages: Array<any>;

    constructor(host: string, port: number) {
        this.ws = new WebSocket(`ws://${host}:${port}/`);
        this.messages = [];
        this.ws.on('message', (data: any) => this.messages.push(data));
    }

    async open(): Promise<void> {
        return new Promise<void>(resolve => {
            // jest automatically timeouts after 5 seconds, if not resolved
            this.ws.on('open', () => resolve());
        });
    }

    send(msg: WebSocket.Data): void {
        this.ws.send(msg);
    }

    clean() {
        this.messages = [];
        this.ws.close();
    }
}

class MockServer {
    app: any;
    server: any;
    host: string;
    port: number;
    mockNamespace: WebSocketServer;
    messages: Array<any>;

    constructor(host: string, port: number, mockNamespace: WebSocketServer) {
        this.host = host;
        this.port = port;
        this.app = express();
        this.server = http.createServer(this.app);
        this.mockNamespace = mockNamespace;
        this.messages = [];

        this.server.on('upgrade', (request: any, socket: any, head: any) => {
            const { pathname } = url.parse(request.url);
            if (pathname === '/') {
                this.mockNamespace.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
                    this.mockNamespace.wss.emit('connection', ws, request);
                });
            } else {
                socket.destroy();
            }
        });
    }

    async start(): Promise<void> {
        return new Promise<void>(resolve => {
            this.server.listen(this.port, this.host, 1024, () => resolve());
        });
    }

    clean() {
        this.mockNamespace.wss.clients.forEach((ws: WebSocket) => {
            ws.close();
        });
        this.server.close();
    }
}

class MockMessageHandler implements MessageHandler {
    res: WebSocket.Data | undefined = undefined;
    handle(message: WebSocket.Data, registeredMethods: Map<string, Method>): HandlerResult {
        return { error: false, data: this.res, func: NOOP, args: [] };
    }

    process(handlerResult: HandlerResult): WebSocket.Data | Promise<WebSocket.Data | undefined> | undefined {
        return this.res;
    }
}

class MockNamespaceA extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
    }
}

class MockNamespaceB extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
    }

    @register()
    foo(a: number, b: number): number {
        return a + b;
    }
}

describe('WebSocketServer abstract class', () => {
    const host = 'localhost';
    const port = 9999;
    let wssOptions: WebSocket.ServerOptions;
    let mockMessageHandler: MockMessageHandler;
    let mockNamespaceA: WebSocketServer;
    let mockNamespaceB: WebSocketServer;
    let mockServer: MockServer;

    beforeAll(async () => {
        wssOptions = { noServer: true };
        mockMessageHandler = new MockMessageHandler();
        mockServer = new MockServer(host, port, new MockNamespaceB(mockMessageHandler, wssOptions));
        try { await mockServer.start(); } catch(err) {}
    });

    afterAll(async () => {
        mockServer.clean();
    });

    it('should instantiate without failure', () => {
        function instantiateMockNamespace() {
            new MockNamespaceA(mockMessageHandler, wssOptions);
        }

        expect(instantiateMockNamespace).not.toThrow(Error);
    });

    it('getMethods() should return Map (string, Method) of namespace methods', () => {
        mockNamespaceA = new MockNamespaceA(mockMessageHandler, wssOptions);
        const methodsNamespaceA = mockNamespaceA.getMethods();

        mockNamespaceB = new MockNamespaceB(mockMessageHandler, wssOptions);
        const methodsNamespaceB = mockNamespaceB.getMethods();

        expect(methodsNamespaceA.size).toBe(0);
        expect(methodsNamespaceA.get('foo')).toBeUndefined();
        expect(methodsNamespaceB.size).toBe(1);
        expect(methodsNamespaceB.get('foo')).not.toBeUndefined();
    });

    it('broadcastMessage(res) should send a message to all connected clients', async () => {
        const mockClientA = new MockClient(host, port);
        const mockClientB = new MockClient(host, port);
        await mockClientA.open();
        await mockClientB.open();

        const message = 'a';
        mockServer.mockNamespace.broadcastMessage(message);
        await sleep(500);
        expect(mockClientA.messages[0]).toBe(message);
        expect(mockClientB.messages[0]).toBe(message);
        mockClientA.clean();
        mockClientB.clean();
    });

    it('_onMessage() should return message handler result to client if defined', async () => {
        const mockClient = new MockClient(host, port);
        await mockClient.open();

        const dat = 'a';
        mockMessageHandler.res = dat;

        mockClient.send(dat);
        await sleep(500);
        expect(mockClient.messages[0]).toBe(dat);
        mockClient.clean();
    });

    it('_onMessage() should return nothing to client if message handler result is undefined', async () => {
        const mockClient = new MockClient(host, port);
        await mockClient.open();

        mockMessageHandler.res = undefined;

        mockClient.send('a');
        await sleep(500);
        expect(mockClient.messages.length).toBe(0);
        mockClient.clean();
    });
});
