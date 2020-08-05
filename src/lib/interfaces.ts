/**
 * A param has a string key and an any value.
 * If it is an expected param -> value is of type string
 */
export type Params = Record<string, any>;

export type MethodArgs = Array<any>;

export interface Request {
    method: string;
    params?: Params | MethodArgs;
}

export type BatchRequest = Request[];

export interface Method {
    namespace: string;
    name: string;
    params: Params;
    func: Function;
}

export interface HandlerResult {
    error: boolean;
    data: any;
    func: Function;
    args: MethodArgs;
}

export interface MessageHandler {
    handle(message: any, methods: Map<string, Method>): HandlerResult;
    process(handlerResult: HandlerResult): any | Promise<any>;
}
