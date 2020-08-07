import * as WebSocket from 'ws';

/**
 * A param has a string key and an any value.
 * If it is an expected param -> value is of type string
 */

export type Params = Record<string, any>;

export type MethodArgs = Array<any>;

export type Request = {
    method: string;
    params?: Params | MethodArgs;
}

export type Method = {
    namespace: string;
    name: string;
    params: Params;
    func: Function;
}

export type ValidationResult = {
    error: boolean;
    data: any;
    func: Function;
    args: MethodArgs;
}

export type HandlerResult = {
    error: boolean;
    data: any;
    ctx: ValidationResult | Array<ValidationResult> | undefined;
};

export interface MessageHandler {
    handle(message: WebSocket.Data, registeredMethods: Map<string, Method>): HandlerResult;
    process(handlerResult: HandlerResult): WebSocket.Data | Promise<WebSocket.Data>;
}
