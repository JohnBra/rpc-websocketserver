import { JSONRPC2ErrorObject, JSONRPC2Id, JSONRPC2Request, JSONRPC2Response } from './interfaces';
import { InvalidRequest } from './errors';

const ERRORS = new Map([
    [-32600, 'Invalid Request'],
    [-32601, 'Method not found'],
    [-32602, 'Invalid params'],
    [-32603, 'Internal error'],
    [-32604, 'Params not found'],
    [-32700, 'Parse error'],
]);

export function buildError(code: number, details?: string | object): JSONRPC2ErrorObject {
    const error: JSONRPC2ErrorObject = { code, message: ERRORS.get(code) || 'Internal server error' };
    if (details) error.data = details;
    return error;
}

export function buildResponse(error: boolean, id: JSONRPC2Id, data: any | JSONRPC2ErrorObject): JSONRPC2Response {
    if (error) return { jsonrpc: '2.0', error: data, id };
    return { jsonrpc: '2.0', result: data, id };
}

export function assertValidRequest(request: any): asserts request is JSONRPC2Request {
    if (request?.jsonrpc !== '2.0')
        throw new InvalidRequest(`Value of 'jsonrpc' must be exactly '2.0' and of type 'string'`);

    if (typeof request?.method !== 'string')
        throw new InvalidRequest(`Value of 'method' must be of type 'string' and can not be omitted`);

    if (request.hasOwnProperty('params')) {
        if (!Array.isArray(request.params) && typeof request.params !== 'object') {
            throw new InvalidRequest(`Value of 'params' must be of type 'array' or 'object'`);
        }
    }

    if (request.hasOwnProperty('id')) {
        if (typeof request.id !== 'string' && typeof request.id !== 'number' && request.id !== null) {
            throw new InvalidRequest(`Value of 'id' should be of type 'string' or 'number'`);
        }
    }
}
