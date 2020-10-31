import { HandlerResult, Method } from '../..';
import SimpleMessageHandler from '../../lib/message-handlers/simple';
import { NOOP } from '../../lib/constants';

describe('SimpleMessageHandler class', () => {
    let registeredMethodA: Method;
    let registeredMethodB: Method;
    let registeredMethodC: Method;
    let registeredMethods: Map<string, Method>;
    let registeredMethodAExpectedArgs: Array<any>;

    beforeAll(()=> {
        registeredMethodA = {
            namespace: 'MockNamespace',
            name: 'mockMethodA',
            params: { a: 'string', b: 'number' },
            func: () => {}
        };
        registeredMethodB = {
            namespace: 'MockNamespace',
            name: 'mockMethodB',
            params: { a: 'number', b: 'number' },
            func: (a: number, b: number) => a+b
        };
        registeredMethodC = {
            namespace: 'MockNamespace',
            name: 'mockMethodC',
            params: { },
            func: (a: number, b: number) => {throw new Error();}
        };
        registeredMethodAExpectedArgs = ['abc', 1];
        registeredMethods = new Map<string, Method>([
            [registeredMethodA.name, registeredMethodA],
            [registeredMethodB.name, registeredMethodB],
            [registeredMethodC.name, registeredMethodC]
        ]);
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

    it('process() should return WebSocket.Data on successful execution ' +
        'of func with defined return value', async () => {
        const arg0 = 0;
        const arg1 = 1;
        const expectedResult = JSON.stringify(arg0 + arg1);
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: undefined,
            func: registeredMethodB.func,
            args: [arg0, arg1]
        };
        const messageHandler = new SimpleMessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeDefined();
        expect(res).toEqual(expectedResult);
    });

    it('process() should return WebSocket.Data on successful execution ' +
        'of func with undefined return value', async () => {
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: undefined,
            func: registeredMethodA.func,
            args: ['abc', 1]
        };
        const messageHandler = new SimpleMessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeUndefined();
    });

    it('process() should return "Internal server error" if executed function throws error', async () => {
        const originalLog = console.log;
        console.log = jest.fn();
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: undefined,
            func: registeredMethodC.func,
            args: []
        };
        const messageHandler = new SimpleMessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toEqual('Internal server error');
        console.log = originalLog;
    });

    it('process() should return data if handler result has error === true', async () => {
        const mockHandlerResult: HandlerResult = {
            error: true,
            data: 'abc',
            func: registeredMethodC.func,
            args: []
        };
        const messageHandler = new SimpleMessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toEqual(mockHandlerResult.data);
    });
});
