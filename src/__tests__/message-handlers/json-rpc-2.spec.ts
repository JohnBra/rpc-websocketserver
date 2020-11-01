import JSONRPC2MessageHandler from '../../lib/message-handlers/json-rpc-2';
import { HandlerResult, Method } from '../../lib/interfaces';
import { NOOP } from '../../lib/constants';

function assertString(val: any): asserts val is string {
    if (typeof val !== 'string') throw Error('Value is not of type string');
}

describe('JSONRPC2MessageHandler class', () => {
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
        function instantiateJSONRPC2MessageHandler() {
            new JSONRPC2MessageHandler();
        }

        expect(instantiateJSONRPC2MessageHandler).not.toThrow();
    });

    it('handle() should return !error handler result on success', () => {
        const id = 1;
        const msg = JSON.stringify({
            jsonrpc: '2.0',
            method: registeredMethodA.name,
            params: { a: 'abc', b: 1 },
            id
        });
        const messageHandler = new JSONRPC2MessageHandler();
        const res = messageHandler.handle(msg, registeredMethods);

        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data.requestId).toEqual(id);
        expect(res.func).toEqual(registeredMethodA.func);
        expect(res.args).toEqual(registeredMethodAExpectedArgs);
    });

    it('handle() should return !error handler result on success without requestId', () => {
        const id = 1;
        const msg = JSON.stringify({
            jsonrpc: '2.0',
            method: registeredMethodA.name,
            params: { a: 'abc', b: 1 }
        });
        const messageHandler = new JSONRPC2MessageHandler();
        const res = messageHandler.handle(msg, registeredMethods);

        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data.hasOwnProperty('requestId')).toBe(false);
        expect(res.func).toEqual(registeredMethodA.func);
        expect(res.args).toEqual(registeredMethodAExpectedArgs);
    });

    it('handle() should return error handler result on invalid request', () => {
        const msg = JSON.stringify({
            params: { a: 'abc', b: 1 }
        });
        const messageHandler = new JSONRPC2MessageHandler();
        const res = messageHandler.handle(msg, registeredMethods);

        expect(res.error).toBe(true);
        expect(res.data).toBeDefined();
        expect(res.func).toEqual(NOOP);
        expect(res.args).toEqual([]);
    });

    it('process() should return execution result wrapped in json rpc 2 response object', async () => {
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: { requestId: 1 },
            func: registeredMethodB.func,
            args: [0, 1]
        };
        const messageHandler = new JSONRPC2MessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeDefined();
        expect(typeof res === 'string').toBe(true);

        assertString(res);
        const o = JSON.parse(res);

        expect(o.jsonrpc).toEqual('2.0');
        expect(o.id).toEqual(mockHandlerResult.data.requestId);
        expect(o.result).toBeDefined();
        expect(o.result).toEqual(mockHandlerResult.func(...mockHandlerResult.args));
    });

    it('process() should return void/undefined if request has no requestId', async () => {
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: {},
            func: registeredMethodB.func,
            args: [0, 1]
        };
        const messageHandler = new JSONRPC2MessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeUndefined();
    });

    it('process() should return json rpc 2 conform error response' +
        ' if handler result error is true', async () => {
        const mockHandlerResult: HandlerResult = {
            error: true,
            data: {
                requestId: 1,
                errorDetails: { code: -32000, message: 'Some error' }
            },
            func: registeredMethodB.func,
            args: [0, 1]
        };
        const messageHandler = new JSONRPC2MessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeDefined();
        expect(typeof res === 'string').toBe(true);

        assertString(res);
        const o = JSON.parse(res);

        expect(o.jsonrpc).toEqual('2.0');
        expect(o.id).toEqual(mockHandlerResult.data.requestId);
        expect(o.error).toBeDefined();
        expect(o.error.code).toEqual(mockHandlerResult.data.errorDetails.code);
        expect(o.error.message).toEqual(mockHandlerResult.data.errorDetails.message);
    });

    it('process() should return json rpc 2 conform error response on execution error', async () => {
        const mockHandlerResult: HandlerResult = {
            error: false,
            data: { requestId: 1 },
            func: registeredMethodC.func,
            args: [0, 1]
        };
        const messageHandler = new JSONRPC2MessageHandler();
        const res = await messageHandler.process({}, mockHandlerResult);

        expect(res).toBeDefined();
        expect(typeof res === 'string').toBe(true);

        assertString(res);
        const o = JSON.parse(res);

        expect(o.jsonrpc).toEqual('2.0');
        expect(o.id).toEqual(mockHandlerResult.data.requestId);
        expect(o.error).toBeDefined();
        expect(o.error.code).toEqual(-32603);
        expect(o.error.message).toEqual('Internal error');
    });
});
