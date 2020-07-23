import * as WebSocket from 'ws';
import { WebSocketServer } from '../lib/websocket-server';
import { MessageHandler } from '../lib/message-handler';
import SimpleMessageHandler from '../lib/simple/message-handler';



class MockNamespace extends WebSocketServer {
    constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        super(messageHandler, options);
    }
}

describe('WebSocketServer abstract class', () => {
    let wssOptions: WebSocket.ServerOptions;
    let simpleMessageHandler: SimpleMessageHandler;

    beforeAll(() => {
        wssOptions = { noServer: true };
        simpleMessageHandler = new SimpleMessageHandler();
    });

    test('instantiates without failure', () => {
        function instantiateMockNamespace() {
            new MockNamespace(simpleMessageHandler, wssOptions);
        }

        expect(instantiateMockNamespace).not.toThrow(Error);
    });
});
