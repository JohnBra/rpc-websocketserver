import { JSONRPC2Error } from '../../lib/json-rpc-2/errors';

describe('JSONRPC2Error base class', () => {
    it('should not throw error on constructor call', () => {

        function instantiateJSONRPC2Error() {
            new JSONRPC2Error(0);
        }

        expect(instantiateJSONRPC2Error).not.toThrow();
    });
});
