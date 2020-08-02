import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class InvalidMethod extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'InvalidMethod';
        this.code = -32601;
        this.message = 'Method not found';
        this.details = details;
    }
}
