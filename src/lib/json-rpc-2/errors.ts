import { ErrorObject, ErrorDetails } from './interfaces';
import { buildError } from './utils';

/**
 * Base JSON RPC 2 error class. Contains JSON RPC 2 conform error object.
 */
export class JSONRPC2Error extends Error {
    readonly object: ErrorObject;

    /**
     * @param code {number} - JSON RPC 2 error code
     * @param details {ErrorDetails} - optional error details to be appended to the error object
     */
    constructor(code: number, details?: ErrorDetails) {
        super();
        this.name = 'JSONRPC2Error';
        this.object = buildError(code, details);
        this.message = this.object.message;
    }
}

/**
 * JSON RPC 2 Parse error class. Contains JSON RPC 2 conform error object including code.
 */
export class ParseError extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32700, details);
        this.name = 'ParseError';
    }
}

/**
 * JSON RPC 2 Invalid request error class. Contains JSON RPC 2 conform error object including code.
 */
export class InvalidRequest extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32600, details);
        this.name = 'InvalidRequest';
    }
}

/**
 * JSON RPC 2 Invalid method error class. Contains JSON RPC 2 conform error object including code.
 */
export class InvalidMethod extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32601, details);
        this.name = 'InvalidMethod';
    }
}

/**
 * JSON RPC 2 Invalid params error class. Contains JSON RPC 2 conform error object including code.
 */
export class InvalidParams extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32602, details);
        this.name = 'InvalidParams';
    }
}

/**
 * JSON RPC 2 Internal error class. Contains JSON RPC 2 conform error object including code.
 */
export class InternalError extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32603, details);
        this.name = 'InternalError';
    }
}
