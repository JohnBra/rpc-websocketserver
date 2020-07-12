export interface Params {
    [key: string]: string; // a param has its name as key and its type as value
}

export interface Method {
    namespace: string;
    method: string | symbol;
    params: Params;
    func: Function;
}

export interface HandlerResult {
    error: boolean;
    data: any;
    func: Function;
    args: Array<any>;
}

export interface MessageHandler {
    handle(message: any, methods: Array<Method>): HandlerResult;
    process(handlerResult: HandlerResult): any;
}
