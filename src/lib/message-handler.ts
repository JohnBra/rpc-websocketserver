export interface Method {
    namespace: string;
    method: string | symbol;
    params: object;
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
}
