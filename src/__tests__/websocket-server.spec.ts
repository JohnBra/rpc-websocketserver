import * as WebSocket from 'ws';
import { WebSocketServer } from '../lib/websocket-server';
import { MessageHandler } from '../lib/interfaces';
import Simple from '../lib/message-handlers/simple';



class MockNamespace extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
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
