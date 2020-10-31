import { Request, Method, MethodArgs, Params } from './interfaces';

/**
 * Interface to pass Error constructor as parameter to function
 */
export interface ErrorType<T extends Error> extends Function {
    new (...args: Array<any>): T;
}

/**
 * Assertion to ensure value to be string or Buffer
 *
 * @param val {*} - value to be asserted on
 * @param Err {ErrorType} - Error to be thrown if assertion fails
 */
export function assertStringOrBuffer(val: any, Err: ErrorType<Error>): asserts val is string | Buffer {
    if (!Buffer.isBuffer(val) && typeof val !== 'string') throw new Err(`Message must be of type 'string' or 'Buffer'`);
}

/**
 * Assertion to ensure value is a valid rpc request object
 *
 * @param val {*} - value to be asserted on
 * @param Err {ErrorType} - Error to be thrown if assertion fails
 */
export function assertValidRequest(val: any, Err: ErrorType<Error>): asserts val is Request {
    if (typeof val?.method !== 'string')
        throw new Err(`Request must include prop 'method' with value of type 'string'`);
    if (val.hasOwnProperty('params')) {
        if (!Array.isArray(val.params) && typeof val.params !== 'object')
            throw new Err(`Params must be one of 'object' or 'array'`);
    }
}

/**
 * Validates and parses a message. Will throw error if parse/validation fails.
 *
 * @param message {*} - message to be parsed and validated
 * @param Err {ErrorType} - Error to be thrown if parse/validation fails
 * @returns {object} - parsed message
 */
export function validateAndParseMessage(message: any, Err: ErrorType<Error>): object {
    assertStringOrBuffer(message, Err);
    try {
        const m = Buffer.isBuffer(message) ? message.toString('utf8') : message;
        return JSON.parse(m);
    } catch (err) {
        throw new Err(err.message);
    }
}

/**
 * Validates method for existence
 *
 * @param methodName {string} - method to be found
 * @param registeredMethods - registered method pool to find method in
 * @param Err - Error to be thrown if method could not be found
 * @returns {Method}
 */
export function validateMethod(
    methodName: string,
    registeredMethods: Map<string, Method>,
    Err: ErrorType<Error>,
): Method {
    const method = registeredMethods.get(methodName);
    if (!method) throw new Err(`Method with name '${methodName}' could not be found.`);
    return method;
}

/**
 * Validates params for correctness
 *
 * @param providedParams {Params | MethodArgs | undefined} - params provided by client
 * @param expectedParams {Params} - expected params of registered method
 * @param Err {ErrorType} - Error to be thrown if params are incorrect
 * @returns {MethodArgs} - args to be passed to function
 */
export function validateParams(
    providedParams: Params | MethodArgs | undefined,
    expectedParams: Params,
    Err: ErrorType<Error>,
): MethodArgs {
    const expectedParamsKeys: Array<string> = Object.keys(expectedParams);
    let providedParamsKeys: Array<string> = [];
    let providedParamsLength = 0;

    if (Array.isArray(providedParams)) {
        providedParamsLength = providedParams.length;
    } else if (typeof providedParams === 'object') {
        providedParamsKeys = Object.keys(providedParams);
        providedParamsLength = providedParamsKeys.length;
    }

    if (providedParamsLength !== expectedParamsKeys.length)
        throw new Err(`Expected ${expectedParamsKeys.length} params. Received ${providedParamsLength}.`);

    let methodArgs: MethodArgs = [];

    if (Array.isArray(providedParams)) {
        methodArgs = providedParams;
    } else if (typeof providedParams === 'object') {
        for (let i = 0; i < expectedParamsKeys.length; i++) {
            if (!providedParams.hasOwnProperty(expectedParamsKeys[i])) {
                throw new Err(`Params must include '${expectedParamsKeys[i]}'`);
            }
            methodArgs.push(providedParams[expectedParamsKeys[i]]);
        }
    }

    return methodArgs;
}
