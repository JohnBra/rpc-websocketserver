import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class InternalError extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'InternalError';
        this.code = -32603;
        this.message = 'Internal error';
        this.details = details;
    }
}
