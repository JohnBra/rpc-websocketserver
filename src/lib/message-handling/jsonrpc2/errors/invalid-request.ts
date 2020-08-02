import { JSONRPC2BaseError } from './base-error';
import { JSONRPC2ErrorDetails } from '../utils';

export class InvalidRequest extends JSONRPC2BaseError {
    constructor(details?: JSONRPC2ErrorDetails) {
        super(-32600, 'Invalid Request', details);
        this.name = 'InvalidRequest';
    }
}
