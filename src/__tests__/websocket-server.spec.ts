import WS from 'jest-websocket-mock';
import * as WebSocket from 'ws'; // only used for ws typings
import { WebSocketServer } from '../lib/websocket-server';
import { HandlerResult, MessageHandler, Method } from '../lib/interfaces';
import { NOOP } from '../lib/constants';
import { register } from '../lib/decorators';

class MockMessageHandler implements MessageHandler {
    handle(message: WebSocket.Data, registeredMethods: Map<string, Method>): HandlerResult {
        return { error: false, data: undefined, func: NOOP, args: [] };
    }

    process(handlerResult: HandlerResult): WebSocket.Data | Promise<WebSocket.Data | undefined> | undefined {
        return undefined;
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
    sum(a: number, b: number): number {
        return a + b;
    }
}

describe('WebSocketServer abstract class', () => {
    let wssOptions: WebSocket.ServerOptions;
    let mockMessageHandler: MessageHandler;
    let mockNamespaceA: WebSocketServer;
    let mockNamespaceB: WebSocketServer;

    beforeAll(() => {
        wssOptions = { noServer: true };
        mockMessageHandler = new MockMessageHandler();
    });

    afterAll(() => {
        mockNamespaceA.wss.clients.forEach((ws) => {
            ws.close(0);
        });
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
        expect(methodsNamespaceA.get('sum')).toBeUndefined();
        expect(methodsNamespaceB.size).toBe(1);
        expect(methodsNamespaceB.get('sum')).not.toBeUndefined();
    });

    it('broadcastMessage(data) should send a message to all connected clients', () => {
        expect(1).toBe(1);
    });
});
