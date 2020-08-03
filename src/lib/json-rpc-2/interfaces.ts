// https://www.jsonrpc.org/specification

export type Id = string | number | null;

export type Params = Record<string, any> | Array<any>;

export type ErrorDetails = object | string | Array<any>;

export interface Request {
    jsonrpc: string; // this must always be exactly "2.0"
    method: string;
    params?: Params;
    id?: Id; // if omitted -> request is notification
}

export interface ErrorObject {
    code: number;
    message: string;
    data?: ErrorDetails;
}

export type ResponseObject =
    | {
          jsonrpc: string; // must be exactly "2.0"
          result: any;
          id: Id;
      }
    | {
          jsonrpc: string; // must be exactly "2.0"
          error: ErrorObject;
          id: Id;
      };
