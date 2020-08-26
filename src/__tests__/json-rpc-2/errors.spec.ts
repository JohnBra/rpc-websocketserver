import {
    InternalError,
    InvalidMethod,
    InvalidParams,
    InvalidRequest,
    JSONRPC2Error,
    ParseError
} from '../../lib/json-rpc-2/errors';
import exp = require("constants");

describe('JSONRPC2Error base class', () => {
    it('should not throw error on constructor call', () => {

        function instantiateJSONRPC2Error() {
            new JSONRPC2Error(0);
        }

        expect(instantiateJSONRPC2Error).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const details = 'a';
        const errA = new JSONRPC2Error(1);
        const errB = new JSONRPC2Error(2, details);

        expect(errA.name).toEqual('JSONRPC2Error');
        expect(errA.message).toEqual('Internal server error');
        expect(errA.object).toBeDefined();
        expect(errA.object.code).toEqual(1);
        expect(errA.object.message).toEqual('Internal server error');
        expect(Object(errA.object).hasOwnProperty('data')).toBe(false);

        expect(errB.name).toEqual('JSONRPC2Error');
        expect(errA.message).toEqual('Internal server error');
        expect(errB.object).toBeDefined();
        expect(errB.object.code).toEqual(2);
        expect(errB.object.message).toEqual('Internal server error');
        expect(Object(errB.object).hasOwnProperty('data')).toBe(true);
        expect(errB.object.data).toEqual(details);
    });
});

describe('ParseError class', () => {
    it('should not throw error on constructor call', () => {
        function instantiateParseError() {
            new ParseError();
        }

        expect(instantiateParseError).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const err = new ParseError();

        expect(err.name).toEqual('ParseError');
        expect(err.message).toEqual('Parse error');
        expect(err.object).toBeDefined();
        expect(err.object.code).toEqual(-32700);
    });
});

describe('InvalidRequest class', () => {
    it('should not throw error on constructor call', () => {
        function instantiateInvalidRequest() {
            new InvalidRequest();
        }

        expect(instantiateInvalidRequest).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const err = new InvalidRequest();

        expect(err.name).toEqual('InvalidRequest');
        expect(err.message).toEqual('Invalid Request');
        expect(err.object).toBeDefined();
        expect(err.object.code).toEqual(-32600);
    });
});

describe('InvalidMethod class', () => {
    it('should not throw error on constructor call', () => {
        function instantiateInvalidMethod() {
            new InvalidMethod();
        }

        expect(instantiateInvalidMethod).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const err = new InvalidMethod();

        expect(err.name).toEqual('InvalidMethod');
        expect(err.message).toEqual('Method not found');
        expect(err.object).toBeDefined();
        expect(err.object.code).toEqual(-32601);
    });
});

describe('InvalidParams class', () => {
    it('should not throw error on constructor call', () => {
        function instantiateInvalidParams() {
            new InvalidParams();
        }

        expect(instantiateInvalidParams).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const err = new InvalidParams();

        expect(err.name).toEqual('InvalidParams');
        expect(err.message).toEqual('Invalid params');
        expect(err.object).toBeDefined();
        expect(err.object.code).toEqual(-32602);
    });
});

describe('InternalError class', () => {
    it('should not throw error on constructor call', () => {
        function instantiateInternalError() {
            new InternalError();
        }

        expect(instantiateInternalError).not.toThrow();
    });

    it('should initialize object instance variable', () => {
        const err = new InternalError();

        expect(err.name).toEqual('InternalError');
        expect(err.message).toEqual('Internal error');
        expect(err.object).toBeDefined();
        expect(err.object.code).toEqual(-32603);
    });
});
