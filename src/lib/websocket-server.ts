import * as WebSocket from 'ws';
import { MessageHandler, Method } from './message-handler';

export abstract class WebSocketServer {
    protected static methods: Array<Method> = [];
    protected readonly _namespaceMethods: Array<Method>;
    protected _messageHandler: MessageHandler;
    public wss: WebSocket.Server;

    protected constructor(options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
        this._messageHandler = undefined;
        this._namespaceMethods = this.getMethods();
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

    protected _broadcastMessage(data: any): void {
        for (const client of this.wss.clients) {
            this._sendMessage(client as WebSocket, data);
        }
    }

    protected _sendMessage(ws: WebSocket, data: any): void {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
    }

    protected _onConnection(ws: WebSocket): void {
        ws.on('message', (message: string) => this._onMessage(ws, message));
    }

    protected _onMessage(ws: WebSocket, message: string): void {
        const handlerResult = this._messageHandler.handle(message, this._namespaceMethods);
        const res = this._messageHandler.process(handlerResult);
        if (res) this._sendMessage(ws, res);
    }
}
