import { JSONRPC2Error, JSONRPC2ErrorDetails } from '../utils';

export abstract class JSONRPC2BaseError extends Error {
    readonly code: number;
    readonly message: string;
    readonly details: JSONRPC2ErrorDetails | undefined;

    protected constructor(code: number, message: string, details?: JSONRPC2ErrorDetails) {
        super();
        this.code = code;
        this.message = message;
        this.details = details;
    }

    getObject(): JSONRPC2Error {
        const jsonRpc2Error: JSONRPC2Error = { code: this.code, message: this.message };
        if (this.details) jsonRpc2Error.data = this.details;
        return jsonRpc2Error;
    }
}
