import Simple from '../../lib/message-handlers/simple';
import { HandlerResult, Method } from '../../lib/interfaces';
import { NOOP } from '../../lib/constants';

class MockClass {
    getThrowErrorFunction(): Function {
        return this.throwError;
    }

    getMockSumFunction(): Function {
        return this.mockSum;
    }

    mockSum(a: string, b: number): string {
        return a + b;
    }

    throwError(): void {
        throw Error('Some error');
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
            new Simple();
        }

        expect(instantiateSimpleMessageHandler).not.toThrow();
    });
});
