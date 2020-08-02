import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../interfaces';

export class ParseError extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super(-32700, 'Parse error', details);
        this.name = 'ParseError';
    }
}
