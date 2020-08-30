import { ErrorObject, ErrorDetails, Id, Request, ResponseObject } from './interfaces';
import { assertValidRequest, ErrorType } from '../utils';

const ERRORS = new Map([
    [-32600, 'Invalid Request'],
    [-32601, 'Method not found'],
    [-32602, 'Invalid params'],
    [-32603, 'Internal error'],
    [-32604, 'Params not found'],
    [-32700, 'Parse error'],
]);

/**
 * Builds and returns a JSON RPC 2 conform error object.
 *
 * @param code {number} - JSON RPC 2 error code
 * @param details {ErrorDetails} - optional primitive or structured value with detailed error information
 */
export function buildError(code: number, details?: ErrorDetails): ErrorObject {
    const error: ErrorObject = { code, message: ERRORS.get(code) || 'Internal server error' };
    if (details) error.data = details;
    return error;
}

/**
 * Builds and returns a JSON RPC 2 conform response object.
 *
 * @param error {boolean} - if true -> builds JSON RPC 2 error response, if false -> JSON RPC 2 result response
 * @param id {Id} - JSON RPC 2 id
 * @param data {any | ErrorObject} - should be rpc result if error is false, otherwise ErrorObject
 */
export function buildResponse(error: boolean, id: Id, data: any | ErrorObject): ResponseObject {
    if (error) return { jsonrpc: '2.0', error: data, id };
    return { jsonrpc: '2.0', result: data, id };
}

export function assertValidJSONRPC2Request(val: any, Err: ErrorType<Error>): asserts val is Request {
    if (val?.jsonrpc !== '2.0')
        throw new Err(`Value of 'jsonrpc' must be exactly '2.0' and of type 'string'`);

    if (val.hasOwnProperty('id')) {
        if (typeof val.id !== 'string' && typeof val.id !== 'number' && val.id !== null) {
            throw new Err(`Value of 'id' should be of type 'string' or 'number'`);
        }
    }

    assertValidRequest(val, Err);
}
