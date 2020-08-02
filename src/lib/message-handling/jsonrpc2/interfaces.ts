// https://www.jsonrpc.org/specification

export const JSON_RPC_ERRORS = new Map([
    [-32600, 'Invalid Request'],
    [-32601, 'Method not found'],
    [-32602, 'Invalid params'],
    [-32603, 'Internal error'],
    [-32604, 'Params not found'],
    [-32700, 'Parse error'],
]);

export const JSON_RPC_VERSION = '2.0';

export type JSONRPC2Id = string | number | null;

export type JSONRPC2Params = Record<string, any> | Array<any>;

export type JSONRPC2Response =
    | {
          jsonrpc: string; // must be exactly "2.0"
          result: any;
          id: JSONRPC2Id;
      }
    | {
          jsonrpc: string; // must be exactly "2.0"
          error: JSONRPC2Error;
          id: JSONRPC2Id;
      };

export interface JSONRPC2Request {
    jsonrpc: string; // this must always be exactly "2.0"
    method: string;
    params: JSONRPC2Params;
    id?: JSONRPC2Id; // if omitted -> request is notification
}

export type JSONRPC2ErrorDetails = object | string | Array<any>;

export interface JSONRPC2Error {
    code: number;
    message: string;
    data?: JSONRPC2ErrorDetails;
}
