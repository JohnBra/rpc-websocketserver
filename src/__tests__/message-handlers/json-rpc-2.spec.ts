import JSONRPC2MessageHandler from '../../lib/message-handlers/json-rpc-2';
import { HandlerResult, Method } from '../../lib/interfaces';
import { NOOP } from "../../lib/constants";

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
        expect(res.data.requestId).toBeDefined();
        expect(res.data.requestId).toEqual(id);
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
});
