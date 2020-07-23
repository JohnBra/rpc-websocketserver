// a param has a string key and an any value, if it is expected param -> value is of type string
export type Params = Record<string, any>;

export interface Method {
    namespace: string;
    name: string | symbol;
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
