import * as WebSocket from 'ws';
import { HandlerResult, MessageHandler, Method } from './message-handler';
import {JSONRPC2MessageHandler} from "./jsonrpc2/json-rpc-2-message-handler";
import {JSONRPC2Error} from "./jsonrpc2/utils";

export class WebSocketServer {
    protected static methods: Array<Method> = [];
    public wss: WebSocket.Server;
    private _messageHandler: MessageHandler;

    constructor(options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
        this._messageHandler = undefined;
    }

    setMessageHandler(mh: MessageHandler): void {
        this._messageHandler = mh;
    }

    getMethods(): Array<Method> {
        const res: Array<Method> = [];
        for (const method of WebSocketServer.methods) {
            if (Object.getPrototypeOf(this).constructor.name === method.namespace) {
                res.push(method);
            }
        }
        return res;
    }

    callMethod(m: HandlerResult): any {
        return m.func(...m.args);
    }

    protected _onConnection(ws: WebSocket): void {
        ws.on('message', (message: string) => this._onMessage(ws, message));
    }

    protected _onMessage(ws: WebSocket, message: string): void {
        if (!this._messageHandler) this.setMessageHandler(new JSONRPC2MessageHandler());
        try {
            const handlerResult: HandlerResult = this._messageHandler.handle(message, this.getMethods());
            let res;
            if (!handlerResult.error) {
                res = this.callMethod(handlerResult);
            } else {
                const err: JSONRPC2Error = JSON.parse(handlerResult.message);
                res = JSONRPC2MessageHandler.buildResponse(0, null, err);
            }
            ws.send(JSON.stringify(res));
        } catch (err) {
            console.log(err);
        }
    }
}
