import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../interfaces';

export class InvalidParams extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super(-32602, 'Invalid params', details);
        this.name = 'InvalidParams';
    }
}
