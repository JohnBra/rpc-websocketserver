import {
    assertStringOrBuffer,
    assertValidRequest,
    validateAndParseMessage,
    validateMethod,
    validateParams
} from '../lib/utils';
import { Params, Method } from '../lib/interfaces';

describe('assertStringOrBuffer', () => {
    it('should not throw error if val is of type string or buffer', () => {
        function validateAssertString() {
            assertStringOrBuffer('a', Error)
        }

        function validateAssertBuffer() {
            const buf = Buffer.alloc(1, 'a');
            assertStringOrBuffer(buf, Error)
        }

        expect(validateAssertString).not.toThrow();
        expect(validateAssertBuffer).not.toThrow();
    });

    it('should throw error if value is not of type string or buffer', () => {
        function validateAssertBufferOrString() {
            assertStringOrBuffer(1, Error);
        }

        expect(validateAssertBufferOrString).toThrow(Error);
    });
});

describe('assertValidRequest', () => {
    const validRequestA = { method: 'foo', params: [] };
    const validRequestB = { method: 'foo', params: {} };
    const validRequestC = { method: 'foo' };

    it('it should not throw error if val is of type request', () => {
        function validateAssertValidRequest() {
            assertValidRequest(validRequestA, Error);
            assertValidRequest(validRequestB, Error);
            assertValidRequest(validRequestC, Error);
        }

        expect(validateAssertValidRequest).not.toThrow();
    });

    it('it should throw error if val is not a valid request', () => {
        function validateAssertValidRequestThrowMethodMissing() {
            const req = { params: [] };
            assertValidRequest(req, Error);
        }

        function validateAssertValidRequestThrowInvalidParamType() {
            const req = { method: 'foo', params: 1 };
            assertValidRequest(req, Error);
        }

        expect(validateAssertValidRequestThrowMethodMissing).toThrow();
        expect(validateAssertValidRequestThrowMethodMissing)
            .toThrow(`Request must include prop 'method' with value of type 'string'`);
        expect(validateAssertValidRequestThrowInvalidParamType).toThrow();
        expect(validateAssertValidRequestThrowInvalidParamType)
            .toThrow(`Params must be one of 'object' or 'array'`);
    });
});

describe('validateAndParseMessage', () => {
    const validStringMessage = JSON.stringify({ method: 'foo' });
    const validBufferMessage = new Buffer(validStringMessage);

    it('should return a JSON object if the message could be parsed successfully', () => {
        const resultA = validateAndParseMessage(validBufferMessage, Error);
        const resultB = validateAndParseMessage(validStringMessage, Error);

        expect(typeof resultA).toBe('object');
        expect(typeof resultB).toBe('object');
    });

    it('should throw error if message is not of type string or buffer', () => {
        function validateAndParseMessageThrowOnIncorrectMessageType() {
            validateAndParseMessage(1, Error);
        }

        expect(validateAndParseMessageThrowOnIncorrectMessageType).toThrow();
    });

    it('should throw error if message could not be parsed', () => {
        function validateAndParseMessageThrowOnIncorrectJson() {
            validateAndParseMessage('[', Error);
        }

        expect(validateAndParseMessageThrowOnIncorrectJson).toThrow();
    });
});

describe('validateParams', () => {
    const expectedParams: Params = {
        'a': 'string',  // value: 'abc'
        'b': 'number',  // value: 1
    };
    const expectedParamsKeys = Object.keys(expectedParams);
    const expectedMethodArgs: Array<any> = ['abc', 1];

    it('should return method args on successful validation of params object', () => {
        const providedParamsObject = { 'a': 'abc', 'b': 1 };

        const methodArgs = validateParams(providedParamsObject, expectedParams, Error);

        expect(methodArgs).toEqual(expectedMethodArgs);
    });

    it('should return method args on successful validation of params array', () => {
        const providedParamsArray = ['abc', 1];

        const methodArgs = validateParams(providedParamsArray, expectedParams, Error);

        expect(methodArgs).toEqual(expectedMethodArgs);
    });

    it('should throw descriptive error if provided and expected params length are not equal', () => {
        const providedParamsObject = { 'a': 'abc', 'b': 1, 'c': 123 };
        const providedParamsObjectLength = Object.keys(providedParamsObject).length;
        const providedParamsArray = ['abc', 1, 123];

        function validateParamsThrowIncorrectLengthObjectError() {
            validateParams(providedParamsObject, expectedParams, Error);
        }

        function validateParamsThrowIncorrectLengthArrayError() {
            validateParams(providedParamsArray, expectedParams, Error);
        }

        expect(validateParamsThrowIncorrectLengthObjectError).toThrow();
        expect(validateParamsThrowIncorrectLengthObjectError)
            .toThrow(`Expected ${expectedParamsKeys.length} params. Received ${providedParamsObjectLength}.`);
        expect(validateParamsThrowIncorrectLengthArrayError).toThrow();
        expect(validateParamsThrowIncorrectLengthArrayError)
            .toThrow(`Expected ${expectedParamsKeys.length} params. Received ${providedParamsArray.length}.`);
    });

    it('should throw descriptive error if param is missing from provided params object', () => {
        const providedParamsObject = { 'c': 'abc', 'b': 1};

        function validateParamsThrowMissingPropertyError() {
            validateParams(providedParamsObject, expectedParams, Error);
        }

        expect(validateParamsThrowMissingPropertyError).toThrow();
        expect(validateParamsThrowMissingPropertyError).toThrow(`Params must include 'a'`);
    });
});

describe('validateMethod', () => {
    const registeredMethodA = { namespace: 'MockNamespace', name: 'mockMethodA', params: {}, func: () => {} };
    const registeredMethodB = { namespace: 'MockNamespace', name: 'mockMethodB', params: {}, func: () => {} }
    const registeredMethods = new Map<string, Method>();
    registeredMethods.set(registeredMethodA.name, registeredMethodA);
    registeredMethods.set(registeredMethodB.name, registeredMethodB);

    it('should return method on successful validation', () => {
        const method: Method = validateMethod(registeredMethodB.name, registeredMethods, Error);

        expect(method.name).toEqual(registeredMethodB.name);
        expect(method.name).not.toEqual(registeredMethodA.name);
    });

    it('should throw a descriptive error when method could not be found', () => {
        const unknownMethodName = 'unknownMethodName';

        function validateMethodThrowError() {
            validateMethod(unknownMethodName, registeredMethods, Error);
        }

        expect(validateMethodThrowError).toThrow();
        expect(validateMethodThrowError).toThrow(Error);
        expect(validateMethodThrowError).toThrow(`Method with name '${unknownMethodName}' could not be found.`)
    });
});
