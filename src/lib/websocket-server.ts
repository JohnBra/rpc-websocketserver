import * as WebSocket from 'ws';
import { HandlerResult, MessageHandler, Method } from './message-handler';
import { JSONRPC2MessageHandler } from './jsonrpc2/json-rpc-2-message-handler';
import { JSONRPC2Error } from './jsonrpc2/utils';

export class WebSocketServer {
    protected static methods: Array<Method> = [];
    public wss: WebSocket.Server;
    private _messageHandler: MessageHandler;

    constructor(options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
        this._messageHandler = undefined;
    }

    setMessageHandler(messageHandler: MessageHandler): void {
        this._messageHandler = messageHandler;
    }

    getMethods(): Array<Method> {
        const methods: Array<Method> = [];
        for (const method of WebSocketServer.methods) {
            if (Object.getPrototypeOf(this).constructor.name === method.namespace) {
                methods.push(method);
            }
        }
        return methods;
    }

    protected _onConnection(ws: WebSocket): void {
        ws.on('message', (message: string) => this._onMessage(ws, message));
    }

    protected _onMessage(ws: WebSocket, message: string): void {
        if (!this._messageHandler) this.setMessageHandler(new JSONRPC2MessageHandler());
        try {
            const handlerResult: HandlerResult = this._messageHandler.handle(message, this.getMethods());
            if (handlerResult.data) ws.send(JSON.stringify(handlerResult.data));
        } catch (err) {
            console.log(err);
        }
    }
}
