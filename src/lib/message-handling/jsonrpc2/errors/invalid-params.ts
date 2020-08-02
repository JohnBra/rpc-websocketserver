import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class InvalidParams extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'InvalidParams';
        this.code = -32602;
        this.message = 'Invalid params';
        this.details = details;
    }
}
