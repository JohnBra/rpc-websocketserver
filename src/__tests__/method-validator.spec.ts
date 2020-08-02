import { validateMethod, MethodValidatorResult } from '../lib/message-handling/method-validator';
import { Method } from '../lib/message-handling/messageHandler';
import { EMPTY_METHOD } from '../lib/message-handling/constants';

describe('Method validator utility', () => {
    const registeredMethodA = { namespace: 'MockNamespace', name: 'mockMethodA', params: {}, func: () => {} };
    const registeredMethodB = { namespace: 'MockNamespace', name: 'mockMethodB', params: {}, func: () => {} }
    const registeredMethods = new Map<string, Method>();
    registeredMethods.set(registeredMethodA.name, registeredMethodA);
    registeredMethods.set(registeredMethodB.name, registeredMethodB);

    test('validateMethod() should return MethodValidatorResult with called method if it is registered', () => {
        const validatorResult: MethodValidatorResult = validateMethod(registeredMethodB.name, registeredMethods);

        expect(validatorResult.error).toBe(false);
        expect(validatorResult.errorMessage).toEqual('');
        expect(validatorResult.method.name).toEqual(registeredMethodB.name);
        expect(validatorResult.method.name).not.toEqual(registeredMethodA.name);
    });

    test('validateMethod() should return MethodValidatorResult with error if method is not registered', () => {
        const unknownMethodName = 'foo';
        const validatorResult: MethodValidatorResult = validateMethod(unknownMethodName, registeredMethods);

        expect(validatorResult.error).toBe(true);
        expect(validatorResult.errorMessage).toEqual(`Method with name '${unknownMethodName}' could not be found.`);
        expect(validatorResult.method).toMatchObject(EMPTY_METHOD);
    });
});
