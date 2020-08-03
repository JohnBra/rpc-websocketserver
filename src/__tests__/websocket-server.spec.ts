import * as WebSocket from 'ws';
import { WebSocketServer } from '../lib/websocket-server';
import { Interfaces } from '../lib/message-handling/messageHandler';
import Simple from '../lib/message-handlers/simple-message-handler';



class MockNamespace extends WebSocketServer {
    constructor(messageHandler: Interfaces, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
    }
}

describe('WebSocketServer abstract class', () => {
    let wssOptions: WebSocket.ServerOptions;
    let simpleMessageHandler: Simple;

    beforeAll(() => {
        wssOptions = { noServer: true };
        simpleMessageHandler = new Simple();
    });

    test('instantiates without failure', () => {
        function instantiateMockNamespace() {
            new MockNamespace(simpleMessageHandler, wssOptions);
        }

        expect(instantiateMockNamespace).not.toThrow(Error);
    });
});
