import { JSONRPC2Error, JSONRPC2ErrorDetails } from '../utils';

export abstract class JSONRPC2BaseError extends Error {
    public code: number;
    public message: string;
    public details: JSONRPC2ErrorDetails | undefined;

    protected constructor(details?: JSONRPC2ErrorDetails) {
        super();
        this.name = 'BaseError';
        this.code = -32099;
        this.message = '';
        this.details = details;
    }

    getObject(): JSONRPC2Error {
        const jsonRpc2Error: JSONRPC2Error = { code: this.code, message: this.message };
        if (this.details) jsonRpc2Error.data = this.details;
        return jsonRpc2Error;
    }
}
