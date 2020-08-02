import SimpleMessageHandler from '../../lib/message-handling/simple-message-handler';
import {HandlerResult, Method} from '../../lib/message-handling/messageHandler';
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

    test('constructor call without parameters does not throw error', () => {

        function instantiateSimpleMessageHandler() {
            new SimpleMessageHandler();
        }

        expect(instantiateSimpleMessageHandler).not.toThrow();
    });


    test('handle() returns HandlerResult with error -> false, ' +
        'data -> undefined and function as well as args assigned with correct input', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const correctMessage = JSON.stringify({method: 'mockMethodA', params: {b: 1, a: 'abc'}});

        const handlerResult: HandlerResult = simpleMessageHandler.handle(correctMessage, registeredMethods);

        expect(handlerResult.error).toBe(false);
        expect(handlerResult.data).toBe(undefined);
        expect(handlerResult.func).toBe(registeredMethodA.func);
        expect(handlerResult.args).toEqual(registeredMethodAExpectedArgs);
    });

    test('handle() returns HandlerResult with error -> true, data -> error message ' +
        'and function assigned with noop as well as args -> empty array on incorrect JSON', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const incorrectMessage = "{";

        function callHandleWithIncorrectJSON() {
            simpleMessageHandler.handle(incorrectMessage, registeredMethods);
        }

        const handlerResult: HandlerResult = simpleMessageHandler.handle(incorrectMessage, registeredMethods);

        expect(callHandleWithIncorrectJSON).not.toThrow(Error);
        expect(handlerResult.error).toBe(true);
        expect(handlerResult.data).not.toBe(undefined);
        expect(handlerResult.func).toEqual(NOOP);
        expect(handlerResult.args).toEqual([]);
    });

    test('handle() returns HandlerResult with error -> true, data -> error message ' +
        'and function assigned with noop as well as args -> empty array on unknown method', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const incorrectMessage = JSON.stringify({method: 'unknownMethodA', params: {b: 1, a: 'abc'}});

        function callHandleWithIncorrectMethod() {
            simpleMessageHandler.handle(incorrectMessage, registeredMethods);
        }

        const handlerResult: HandlerResult = simpleMessageHandler.handle(incorrectMessage, registeredMethods);

        expect(callHandleWithIncorrectMethod).not.toThrow(Error);
        expect(handlerResult.error).toBe(true);
        expect(handlerResult.data).not.toBe(undefined);
        expect(handlerResult.func).toEqual(NOOP);
        expect(handlerResult.args).toEqual([]);
    });

    test('handle() returns HandlerResult with error -> true, data -> error message ' +
        'and function assigned with noop as well as args -> empty array on incorrect params', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const incorrectMessage = JSON.stringify({method: 'mockMethodA', params: {b: 1, c: 'abc'}});

        function callHandleWithIncorrectParams() {
            simpleMessageHandler.handle(incorrectMessage, registeredMethods);
        }

        const handlerResult: HandlerResult = simpleMessageHandler.handle(incorrectMessage, registeredMethods);

        expect(callHandleWithIncorrectParams).not.toThrow(Error);
        expect(handlerResult.error).toBe(true);
        expect(handlerResult.data).not.toBe(undefined);
        expect(handlerResult.func).toEqual(NOOP);
        expect(handlerResult.args).toEqual([]);
    });

    test('process() should call function with provided func and args if error is false' +
        ' as well as return function result', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const mockClass = new MockClass();
        const spyMockSum = jest.spyOn(MockClass.prototype, 'mockSum');
        const handlerResult: HandlerResult = {
            error: false,
            data: undefined,
            args: ['abc', 1],
            func: mockClass.getMockSumFunction()
        };

        const res = simpleMessageHandler.process(handlerResult);

        expect(res).toBe('abc1');
        expect(spyMockSum).toHaveBeenCalledTimes(1);
        spyMockSum.mockClear();
    });

    test('process() should return handler result data if error is true', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const handlerResult: HandlerResult = { error: true, data: 'some error message', args: [], func: NOOP };

        const res = simpleMessageHandler.process(handlerResult);

        expect(res).toBe('some error message');
    });

    test('process() should console log error if called function throws', () => {
        const simpleMessageHandler = new SimpleMessageHandler();
        const originalLog = console.log;
        console.log = jest.fn();
        const spyLog = jest.spyOn(console, 'log');
        const mockClass = new MockClass();
        const handlerResult: HandlerResult = {
            error: false,
            data: undefined,
            args: [],
            func: mockClass.getThrowErrorFunction()
        };

        function callFunctionThatThrowsError() {
            simpleMessageHandler.process(handlerResult);
        }

        expect(callFunctionThatThrowsError).not.toThrow(Error);
        expect(spyLog).toHaveBeenCalledTimes(1);

        spyLog.mockClear();
        console.log = originalLog;
    });
});
