import { validateMethod, validateParams } from '../lib/utils';
import { Params, Method } from '../lib/interfaces';
import { EMPTY_METHOD } from "../lib/constants";

describe('validateParams', () => {
    const expectedParams: Params = {
        'a': 'string',  // value: 'abc'
        'b': 'number',  // value: 1
    };
    const expectedParamsKeys = Object.keys(expectedParams);
    const expectedMethodArgs: Array<any> = ['abc', 1];

    test('should return method args on successful validation', () => {
        const providedParamsObject = { 'a': 'abc', 'b': 1 };

        const paramValidatorResult = validateParams(providedParamsObject, expectedParams, Error);

        expect(paramValidatorResult).toEqual(expectedMethodArgs);
    });
});

describe('validateMethod', () => {
    const registeredMethodA = { namespace: 'MockNamespace', name: 'mockMethodA', params: {}, func: () => {} };
    const registeredMethodB = { namespace: 'MockNamespace', name: 'mockMethodB', params: {}, func: () => {} }
    const registeredMethods = new Map<string, Method>();
    registeredMethods.set(registeredMethodA.name, registeredMethodA);
    registeredMethods.set(registeredMethodB.name, registeredMethodB);

    test('should return method on successful validation', () => {
        const validatorResult: Method = validateMethod(registeredMethodB.name, registeredMethods, Error);

        expect(validatorResult.name).toEqual(registeredMethodB.name);
        expect(validatorResult.name).not.toEqual(registeredMethodA.name);
    });
});
