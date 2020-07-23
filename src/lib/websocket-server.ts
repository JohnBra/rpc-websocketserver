import * as WebSocket from 'ws';
import { MessageHandler, Method } from './message-handler';

export abstract class WebSocketServer {
    protected static methods: Set<Method> = new Set();
    protected readonly _namespaceMethods: Array<Method>; // TODO make this a map?
    protected _messageHandler: MessageHandler;
    public wss: WebSocket.Server;

    protected constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
        this._namespaceMethods = this.getMethods();
        this._messageHandler = messageHandler;
    }

    getMethods(): Array<Method> {
        const methods: Array<Method> = [];
        const thisNamespace = Object.getPrototypeOf(this).constructor.name;
        WebSocketServer.methods.forEach((method: Method) => {
            if (thisNamespace === method.namespace) methods.push(method);
        });
        return methods;
    }

    protected _broadcastMessage(data: any): void {
        this.wss.clients.forEach((client) => this._sendMessage(client as WebSocket, data));
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
