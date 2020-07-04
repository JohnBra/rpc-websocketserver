import * as WebSocket from 'ws';
import { Method } from './message-handler';

export class WebSocketServer {
    protected static methods: Array<Method> = [];

    public wss: WebSocket.Server;

    constructor(options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
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

    callMethod(method: string, params: object | Array<any>): void {
        for (const m of this.getMethods()) {
            if (m.method === method) {
                let methodArgs: Array<any> = [];
                if (!Array.isArray(params)) {
                    const expectedParamsList: Array<string> = Object.keys(m.params);
                    for (let i = 0; i < expectedParamsList.length; i++) {
                        methodArgs.push(params[expectedParamsList[i]]);
                    }
                } else {
                    methodArgs = params;
                }

                m.func(...methodArgs);
                break;
            }
        }
    }

    protected _onConnection(ws: WebSocket) {
        ws.on('message', (message: string) => this._onMessage(message));
    }

    protected _onMessage(message: string) {
        console.log(`received message on ws: ${message}`);
    }
}
