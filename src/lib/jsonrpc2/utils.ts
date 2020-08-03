import { ErrorObject, Id, Request, ResponseObject } from './interfaces';
import { InvalidRequest } from './errors';
import { assertValidRequest } from '../utils';

const ERRORS = new Map([
    [-32600, 'Invalid Request'],
    [-32601, 'Method not found'],
    [-32602, 'Invalid params'],
    [-32603, 'Internal error'],
    [-32604, 'Params not found'],
    [-32700, 'Parse error'],
]);

export function buildError(code: number, details?: string | object): ErrorObject {
    const error: ErrorObject = { code, message: ERRORS.get(code) || 'Internal server error' };
    if (details) error.data = details;
    return error;
}

export function buildResponse(error: boolean, id: Id, data: any | ErrorObject): ResponseObject {
    if (error) return { jsonrpc: '2.0', error: data, id };
    return { jsonrpc: '2.0', result: data, id };
}

export function assertValidJSONRPC2Request(val: any): asserts val is Request {
    if (val?.jsonrpc !== '2.0')
        throw new InvalidRequest(`Value of 'jsonrpc' must be exactly '2.0' and of type 'string'`);

    if (val.hasOwnProperty('id')) {
        if (typeof val.id !== 'string' && typeof val.id !== 'number' && val.id !== null) {
            throw new InvalidRequest(`Value of 'id' should be of type 'string' or 'number'`);
        }
    }

    assertValidRequest(val, InvalidRequest);
}
