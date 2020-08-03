import { ErrorObject, ErrorDetails } from './interfaces';
import { buildError } from './utils';

export class JSONRPC2Error extends Error {
    readonly object: ErrorObject;

    constructor(code: number, details?: ErrorDetails) {
        super();
        this.name = 'JSONRPC2Error';
        this.object = buildError(code, details);
        this.message = this.object.message;
    }
}

export class ParseError extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32700, details);
        this.name = 'ParseError';
    }
}

export class InvalidRequest extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32600, details);
        this.name = 'InvalidRequest';
    }
}

export class InvalidMethod extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32601, details);
        this.name = 'InvalidMethod';
    }
}

export class InvalidParams extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32602, details);
        this.name = 'InvalidParams';
    }
}

export class InternalError extends JSONRPC2Error {
    constructor(details?: ErrorDetails) {
        super(-32603, details);
        this.name = 'InternalError';
    }
}
