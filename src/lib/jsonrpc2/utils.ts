// https://www.jsonrpc.org/specification

export const errors = new Map([
    [-32600, 'Invalid Request'],
    [-32601, 'Method not found'],
    [-32602, 'Invalid params'],
    [-32603, 'Internal error'],
    [-32604, 'Params not found'],
    [-32700, 'Parse error']
]);

export type JSONRPC2Id = string | number | null;

export interface JSONRPC2Request {
    jsonrpc: string;                // this must always be exactly "2.0"
    method: string;
    params?: object | Array<any>;
    id?: JSONRPC2Id;    // if omitted -> request is notification
}

export type JSONRPC2Response = {
    jsonrpc: string,    // must be exactly "2.0"
    result: any,
    id: JSONRPC2Id,
} | {
    jsonrpc: string,    // must be exactly "2.0"
    error: JSONRPC2Error,
    id: JSONRPC2Id,
}

export interface JSONRPC2Error {
    code: number;
    message: string;
    data?: string | object;
}
