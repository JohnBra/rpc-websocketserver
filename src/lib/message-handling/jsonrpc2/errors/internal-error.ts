import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../interfaces';

export class InternalError extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super(-32603, 'Internal error', details);
        this.name = 'InternalError';
    }
}
