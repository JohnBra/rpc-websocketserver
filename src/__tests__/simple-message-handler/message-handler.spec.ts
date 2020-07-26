import SimpleMessageHandler from '../../lib/simple-message-handler/message-handler';
import {HandlerResult, Method} from '../../lib/message-handler';
import { NOOP } from '../../lib/constants';

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
});
