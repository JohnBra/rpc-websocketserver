export interface Method {
    namespace: string;
    method: string | symbol;
    params: object;
    func: Function;
}

export interface HandlerResult {
    error: boolean;
    message: string | object | number;
    func: Function;
    args: Array<any>;
}

export interface MessageHandler {
    handle(message: any, methods: Array<Method>): Promise<HandlerResult> | HandlerResult;
}
