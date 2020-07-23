import { validateParams, ParamValidatorResult } from '../lib/param-validator';
import { Params } from '../lib/message-handler';

describe('Params validator utility', () => {
    const expectedParams: Params = {
        'a': 'string',  // value: 'abc'
        'b': 'number',  // value: 1
    };
    const expectedParamsKeys = Object.keys(expectedParams);

    const expectedMethodArgs: Array<any> = ['abc', 1];

    test('validateParams() should return ParamValidatorResult ' +
        'with method args array if correct object', () => {
        const providedParamsObject = { 'a': 'abc', 'b': 1 };

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParamsObject, expectedParams);

        expect(paramValidatorResult.error).toBe(false);
        expect(paramValidatorResult.errorMessage).toEqual('');
        expect(paramValidatorResult.methodArgs).toEqual(expectedMethodArgs);
    });

    test('validateParams() should return ParamValidatorResult ' +
        'method args in correct order in any provided constellation', () => {
        const providedParamsObjectA = { 'b': 1, 'a': 'abc' };
        const providedParamsObjectB = { 'a': 'abc', 'b': 1 };

        const paramValidatorResultA: ParamValidatorResult = validateParams(providedParamsObjectA, expectedParams);
        const paramValidatorResultB: ParamValidatorResult = validateParams(providedParamsObjectB, expectedParams);

        expect(paramValidatorResultA.error).toBe(false);
        expect(paramValidatorResultA.errorMessage).toEqual('');
        expect(paramValidatorResultA.methodArgs).toEqual(expectedMethodArgs);
        expect(paramValidatorResultB.error).toBe(false);
        expect(paramValidatorResultB.errorMessage).toEqual('');
        expect(paramValidatorResultB.methodArgs).toEqual(expectedMethodArgs);
    });

    test('validateParams() should return ParamValidatorResult ' +
        'with method args array if correct array', () => {
        const providedParamsObject = ['abc', 1];

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParamsObject, expectedParams);

        expect(paramValidatorResult.error).toBe(false);
        expect(paramValidatorResult.errorMessage).toEqual('');
        expect(paramValidatorResult.methodArgs).toEqual(expectedMethodArgs);
    });

    test('validateParams() should return ParamValidatorResult with error' +
        ' if params are not of type object or array', () => {
        const providedParams = 0;

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParams as unknown as object, expectedParams);

        expect(paramValidatorResult.error).toBe(true);
        expect(paramValidatorResult.errorMessage).toEqual(`Params must be one of 'object' or 'array'`);
        expect(paramValidatorResult.methodArgs).toEqual([]);
    });

    test('validateParams() should return ParamValidatorResult with error' +
        ' if count of params in object is incorrect', () => {
        const providedParamsObject = { 'b': 1, 'a': 'abc', 'c': true };
        const providedParamsObjectKeys = Object.keys(providedParamsObject);

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParamsObject, expectedParams);

        expect(paramValidatorResult.error).toBe(true);
        expect(paramValidatorResult.errorMessage).toEqual(`Expected ${expectedParamsKeys.length} params. Received ${providedParamsObjectKeys.length}.`);
        expect(paramValidatorResult.methodArgs).toEqual([]);
    });

    test('validateParams() should return ParamValidatorResult with error' +
        ' if count of params in array is incorrect', () => {
        const providedParamsArray = [1, 'abc', true];

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParamsArray, expectedParams);

        expect(paramValidatorResult.error).toBe(true);
        expect(paramValidatorResult.errorMessage).toEqual(`Expected ${expectedParamsKeys.length} params. Received ${providedParamsArray.length}.`);
        expect(paramValidatorResult.methodArgs).toEqual([]);
    });

    test('validateParams() should return ParamValidatorResult with error' +
        ' if param is missing from params object', () => {
        const providedParamsObject = { 'b': 1, 'c': true };

        const paramValidatorResult: ParamValidatorResult = validateParams(providedParamsObject, expectedParams);

        expect(paramValidatorResult.error).toBe(true);
        expect(paramValidatorResult.errorMessage).toEqual(`Params must include 'a'`);
        expect(paramValidatorResult.methodArgs).toEqual([]);
    });
});
