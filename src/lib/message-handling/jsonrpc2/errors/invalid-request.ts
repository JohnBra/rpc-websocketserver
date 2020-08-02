import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class InvalidRequest extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'InvalidRequest';
        this.code = -32600;
        this.message = 'Invalid Request';
        this.details = details;
    }
}
