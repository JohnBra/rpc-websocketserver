import { assertValidJSONRPC2Request, buildError, buildResponse } from '../../lib/json-rpc-2/utils';
import { ResponseObject } from '../../lib/json-rpc-2/interfaces';

describe('assertValidJSONRPC2Request', () => {
    const validRequestA = { jsonrpc: '2.0', method: 'foo', params: [], id: 1 };
    const invalidRequestA = {};
    const invalidRequestB = { jsonrpc: '1.0' };
    const invalidRequestC = { jsonrpc: '2.0', id: {} };

    it('should not throw error if val is a valid request', () => {
        function validateAssertValidJSONRPC2Request() {
            assertValidJSONRPC2Request(validRequestA, Error);
        }

        expect(validateAssertValidJSONRPC2Request).not.toThrow();
    });

    it('should throw error if val is not a valid request', () => {
        function getInvalidRequestA() {
            assertValidJSONRPC2Request(invalidRequestA, Error);
        }

        function getInvalidRequestB() {
            assertValidJSONRPC2Request(invalidRequestB, Error);
        }

        function getInvalidRequestC() {
            assertValidJSONRPC2Request(invalidRequestC, Error);
        }

        expect(getInvalidRequestA).toThrow();
        expect(getInvalidRequestB).toThrow();
        expect(getInvalidRequestC).toThrow();
    });
});

describe('buildError()', () => {
    it('should build json rpc 2 conform error object', () => {
        const details = 'abc';
        const errA = buildError(-32600);
        const errB = buildError(-32600, details);

        expect(errA.code).toEqual(-32600);
        expect(errA.message).toEqual('Invalid Request');
        expect(Object(errA.data).hasOwnProperty('data')).toBe(false);

        expect(errB.code).toEqual(-32600);
        expect(errB.message).toEqual('Invalid Request');
        expect(Object(errB).hasOwnProperty('data')).toBe(true);
        expect(errB.data).toEqual(details);
    });

    it('should build json rpc 2 conform error object with fallback on unknown code', () => {
        const err = buildError(0);

        expect(err.code).toEqual(0);
        expect(err.message).toEqual('Internal server error');
    });
});


describe('buildResponse()', () => {
    it('should return json rpc 2 response object if no error', () => {
        const id = 1;
        const data = 'abc';
        const res: any = buildResponse(false, id, data);

        expect(Object(res).hasOwnProperty('id')).toBe(true);
        expect(Object(res).hasOwnProperty('jsonrpc')).toBe(true);
        expect(Object(res).hasOwnProperty('result')).toBe(true);
        expect(Object(res).hasOwnProperty('error')).toBe(false);
        expect(res.id).toEqual(id);
        expect(res.result).toEqual(data);
    });

    it('should return json rpc 2 error object if error', () => {
        const id = 1;
        const data = { code: 1, message: 'a' };
        const res: any = buildResponse(true, id, data);

        expect(Object(res).hasOwnProperty('id')).toBe(true);
        expect(Object(res).hasOwnProperty('jsonrpc')).toBe(true);
        expect(Object(res).hasOwnProperty('result')).toBe(false);
        expect(Object(res).hasOwnProperty('error')).toBe(true);
        expect(res.id).toEqual(id);
        expect(res.error).toMatchObject(data);
    });
});
