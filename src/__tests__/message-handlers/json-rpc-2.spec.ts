import JSONRPC2MessageHandler from '../../lib/message-handlers/json-rpc-2';
import { HandlerResult, Method } from '../../lib/interfaces';

describe('JSONRPC2MessageHandler class', () => {
    let registeredMethodA: Method;
    let registeredMethods: Map<string, Method>;
    let registeredMethodAExpectedArgs: Array<any>;

    beforeAll(()=> {
        registeredMethodA = {
            namespace: 'MockNamespace',
            name: 'mockMethodA',
            params: { a: 'string', b: 'number' },
            func: () => {}
        };
        registeredMethodAExpectedArgs = ['abc', 1];
        registeredMethods = new Map<string, Method>();
        registeredMethods.set(registeredMethodA.name, registeredMethodA);
    });

    it('should not throw error on constructor call without parameters', () => {

        function instantiateJSONRPC2MessageHandler() {
            new JSONRPC2MessageHandler();
        }

        expect(instantiateJSONRPC2MessageHandler).not.toThrow();
    });
});
