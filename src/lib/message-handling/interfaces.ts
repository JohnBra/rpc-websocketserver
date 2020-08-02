/**
 * A param has a string key and an any value.
 * If it is an expected param -> value is of type string
 */
export type Params = Record<string, any>;

export interface Method {
    namespace: string;
    name: string;
    params: Params;
    func: Function;
}

export interface ParamValidatorResult {
    error: boolean;
    errorMessage: string;
    methodArgs: Array<any>;
}

export interface MethodValidatorResult {
    error: boolean;
    errorMessage: string;
    method: Method;
}

export interface HandlerResult {
    error: boolean;
    data: any;
    func: Function;
    args: Array<any>;
}

export interface MessageHandler {
    handle(message: any, methods: Map<string, Method>): HandlerResult;
    process(handlerResult: HandlerResult): any | Promise<any>;
}
