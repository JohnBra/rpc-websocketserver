import WebSocket from 'ws';

/**
 * A param has a string key and an any value.
 * If it is an expected param -> value is of type string
 */
export type Params = Record<string, any>;

/**
 * RPC method args
 */
export type MethodArgs = Array<any>;

/**
 * Expected request from clients
 */
export type Request = {
    /** Method (RPC) to be called */
    method: string;
    /** Optional params object or array */
    params?: Params | MethodArgs;
};

/**
 * Method type
 */
export type Method = {
    /** Namespace the method is registered in */
    namespace: string;
    /** Method name (identifier) */
    name: string;
    /** Registered params for method */
    params: Params;
    /** Reference to function */
    func: Function;
};

/**
 * Describes a message handler result
 */
export type HandlerResult = {
    /** Should be true when message has error, false otherwise */
    error: boolean;
    /** Convenience property to hold any kind of data */
    data: any;
    /** RPC to be called */
    func: Function;
    /** Args to be passed to function */
    args: MethodArgs;
};

/**
 * Describes a message handler including functions to handle incoming requests as well as
 * processing of the handled result
 */
export interface MessageHandler {
    /**
     * Should implement message parsing, request validation, method validation and param validation
     *
     * @param message {WebSocket.Data} - received message
     * @param registeredMethods {Map<string, Method>} - methods registered in namespace
     * @returns {HandlerResult} - result of message validation
     */
    handle(message: WebSocket.Data, registeredMethods: Map<string, Method>): HandlerResult;

    /**
     * Should implement execution of method and return undefined or data to reply to client
     *
     * @param context {any} - context of the calling class to properly handle 'this' in the function call
     * @param handlerResult {HandlerResult} - message handler result
     * @returns {WebSocket.Data | undefined | Promise<WebSocket.Data | undefined>}
     */
    process(
        context: any,
        handlerResult: HandlerResult,
    ): WebSocket.Data | undefined | Promise<WebSocket.Data | undefined>;
}
