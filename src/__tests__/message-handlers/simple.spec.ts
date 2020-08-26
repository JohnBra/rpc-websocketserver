import { Method } from '../../lib/interfaces';
import SimpleMessageHandler from "../../lib/message-handlers/simple";
import { NOOP } from "../../lib/constants";

class MockNamespace {
    getMockSumFunction(): Function {
        return this.mockSum;
    }

    mockSum(a: string, b: number): string {
        return a + b;
    }
}

describe('SimpleMessageHandler class', () => {
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
        function instantiateSimpleMessageHandler() {
            new SimpleMessageHandler();
        }

        expect(instantiateSimpleMessageHandler).not.toThrow();
    });

    it('handle() should return !error handler result on success', () => {
        const msg = JSON.stringify({method: registeredMethodA.name, params: { a: 'abc', b: 1 }});
        const messageHandler = new SimpleMessageHandler();
        const res = messageHandler.handle(msg, registeredMethods);

        expect(res.error).toBe(false);
        expect(res.data).toBeUndefined();
        expect(res.func).toEqual(registeredMethodA.func);
        expect(res.args).toEqual(registeredMethodAExpectedArgs);
    });

    it('handle() should return error handler result on failure', () => {
        const msg = JSON.stringify({ params: { a: 'abc', b: 1 } });
        const messageHandler = new SimpleMessageHandler();
        const res = messageHandler.handle(msg, registeredMethods);

        expect(res.error).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.func).toEqual(NOOP);
        expect(res.args).toEqual([]);
    });
});
