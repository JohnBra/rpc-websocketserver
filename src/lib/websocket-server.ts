import WebSocket from 'ws';
import { MessageHandler, Method } from './interfaces';

export abstract class WebSocketServer {
    public wss: WebSocket.Server;
    protected static methods: Set<Method> = new Set();
    protected readonly _namespaceMethods: Map<string, Method>;
    protected _messageHandler: MessageHandler;

    protected constructor(messageHandler: MessageHandler, options: WebSocket.ServerOptions) {
        this.wss = new WebSocket.Server(options);
        this.wss.addListener('connection', (ws: WebSocket) => this._onConnection(ws));
        this._namespaceMethods = this._initNamespaceMethods();
        this._messageHandler = messageHandler;
    }

    /**
     * Returns all registered methods of namespace
     *
     * @returns {Map<string, Method>} - Map of all registered methods in namespace with method name as key
     */
    getMethods(): Map<string, Method> {
        return this._namespaceMethods;
    }

    /**
     * Sends passed data to all connected clients
     *
     * @param {WebSocket.Data} data - data to be sent to clients
     */
    broadcastMessage(data: WebSocket.Data): void {
        this.wss.clients.forEach((client: WebSocket) => this._sendMessage(client, data));
    }

    /**
     * Sends passed data to passed websocket
     *
     * @param ws {WebSocket} - client to receive data
     * @param data {WebSocket.Data} - data to be sent to client
     * @protected
     */
    protected _sendMessage(ws: WebSocket, data: WebSocket.Data): void {
        if (ws.readyState === WebSocket.OPEN) ws.send(data);
    }

    /**
     * Convenience method to set listeners on websocket connection
     *
     * @param ws {WebSocket} - websocket/client that established a connection
     * @protected
     */
    protected _onConnection(ws: WebSocket): void {
        ws.on('message', async (message: WebSocket.Data) => this._onMessage(ws, message));
    }

    /**
     * On message listener to handle and process incoming messages
     *
     * @param ws {WebSocket} - websocket/client that sent the message
     * @param message {WebSocket.Data} - data received from the client
     * @protected
     *
     * @returns {Promise<void>}
     */
    protected async _onMessage(ws: WebSocket, message: WebSocket.Data): Promise<void> {
        try {
            const handlerResult = this._messageHandler.handle(message, this._namespaceMethods);
            const res = await this._messageHandler.process(handlerResult);
            if (res) this._sendMessage(ws, res);
        } catch (err) {
            // do nothing or potentially log error
        }
    }

    /**
     * Convenience method to initialize namespace specific methods instance variable from all registered methods
     *
     * @returns {Map<string, Method>} - Map of all registered methods in namespace with method name as key
     */
    private _initNamespaceMethods(): Map<string, Method> {
        const namespaceMethods = new Map<string, Method>();
        const thisNamespace = Object.getPrototypeOf(this).constructor.name;
        WebSocketServer.methods.forEach((method: Method) => {
            if (thisNamespace === method.namespace) namespaceMethods.set(method.name, method);
        });
        return namespaceMethods;
    }
}
