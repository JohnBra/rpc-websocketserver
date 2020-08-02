import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../interfaces';

export class InvalidMethod extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super(-32601, 'Method not found', details);
        this.name = 'InvalidMethod';
    }
}
