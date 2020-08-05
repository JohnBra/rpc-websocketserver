// https://www.jsonrpc.org/specification

export type Id = string | number | null;

export type Params = Record<string, any> | Array<any>;

export type ErrorDetails = object | string | Array<any>;

export type Request = {
    jsonrpc: '2.0';
    method: string;
    params?: Params;
    id?: Id;
};

export type ErrorObject = {
    code: number;
    message: string;
    data?: ErrorDetails;
}

export type ResponseObject =
    | {
        jsonrpc: '2.0';
        result: any;
        id: Id;
      }
    | {
        jsonrpc: '2.0';
        error: ErrorObject;
        id: Id;
      };
