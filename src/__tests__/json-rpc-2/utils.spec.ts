import { assertValidJSONRPC2Request } from '../../lib/json-rpc-2/utils';

describe('assertValidJSONRPC2Request', () => {
    const validRequestA = { jsonrpc: '2.0', method: 'foo', params: [], id: 1 };

    it('it should not throw error if val is of type request', () => {
        function validateAssertValidJSONRPC2Request() {
            assertValidJSONRPC2Request(validRequestA, Error);
        }

        expect(validateAssertValidJSONRPC2Request).not.toThrow();
    });
});
