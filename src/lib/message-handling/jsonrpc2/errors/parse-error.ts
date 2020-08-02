import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class ParseError extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'ParseError';
        this.code = -32700;
        this.message = 'Parse error';
        this.details = details;
    }
}
