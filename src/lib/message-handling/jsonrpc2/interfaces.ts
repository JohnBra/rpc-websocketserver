// https://www.jsonrpc.org/specification

export type JSONRPC2Id = string | number | null;

export type JSONRPC2Params = Record<string, any> | Array<any>;

export type JSONRPC2ErrorDetails = object | string | Array<any>;

export interface JSONRPC2Request {
    jsonrpc: string; // this must always be exactly "2.0"
    method: string;
    params: JSONRPC2Params;
    id?: JSONRPC2Id; // if omitted -> request is notification
}

export interface JSONRPC2ErrorObject {
    code: number;
    message: string;
    data?: JSONRPC2ErrorDetails;
}

export type JSONRPC2Response =
    | {
          jsonrpc: string; // must be exactly "2.0"
          result: any;
          id: JSONRPC2Id;
      }
    | {
          jsonrpc: string; // must be exactly "2.0"
          error: JSONRPC2ErrorObject;
          id: JSONRPC2Id;
      };
