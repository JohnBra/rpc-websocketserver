import { JSONRPC2Error, JSONRPC2ErrorDetails } from '../interfaces';

export abstract class JSONRPC2BaseError extends Error {
    readonly object: JSONRPC2Error;

    protected constructor(code: number, message: string, details?: JSONRPC2ErrorDetails) {
        super(message);
        this.name = 'BaseError';
        this.object = { code, message };
        if (details) this.object.data = details;
    }
}
