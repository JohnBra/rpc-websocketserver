import 'reflect-metadata';
import {param, PARAM_NAMES_KEY, register} from '../lib/decorators';
import { WebSocketServer } from '../lib/websocket-server';

const paramNameA = 'a';
const paramNameB = 'b';

class DummyNamespace extends WebSocketServer {
    rpcA(@param(paramNameA) a: string): void {};
}

describe('param decorator', () => {
    it('should return a function', () => {
        const result = param('a');
        expect(typeof result).toBe('function');
    });

    it('should add param name to target metadata', () => {
        const decorator = param(paramNameA);
        let target = function (){};
        decorator(target, 'name', 0);

        const result = Reflect.getOwnMetadata(PARAM_NAMES_KEY, target, 'name');

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toEqual(paramNameA);
    });

    it('should add multiple param names to target metadata', () => {
        const functionName = 'name';
        const decorateParamA = param(paramNameA);
        const decorateParamB = param(paramNameB);
        let target = function (){};
        decorateParamB(target, functionName, 1)
        decorateParamA(target, functionName, 0);

        const result = Reflect.getOwnMetadata(PARAM_NAMES_KEY, target, functionName);

        expect(Array.isArray(result)).toBe(true);
        expect(result[0]).toEqual(paramNameA);
        expect(result[1]).toEqual(paramNameB);
    });
});


describe('register decorator', () => {
    it('should return a function', () => {
        const result = register('a');
        expect(typeof result).toBe('function');
    });
});
