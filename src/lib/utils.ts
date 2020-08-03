import { Request, Method, MethodArgs, Params } from './interfaces';

export interface E<T extends Error> extends Function {
    new (...args: Array<any>): T;
}

export function assertValidMessageType(val: any, Err: E<Error>): asserts val is Buffer | string {
    if (!Buffer.isBuffer(val) && typeof val !== 'string')
        throw new Err(`Message must be of type 'Buffer' or 'string'`);
}

export function assertValidRequest(val: any, Err: E<Error>): asserts val is Request {
    if (typeof val?.method !== 'string')
        throw new Err(`Request must include prop 'method' with value of type 'string'`);
    if (val.hasOwnProperty('params')) {
        if (!Array.isArray(val.params) && typeof val.params !== 'object')
            throw new Err(`Params must be one of 'object' or 'array'`);
    }
}

export function parseRequest(message: any, Err: E<Error>): JSON {
    assertValidMessageType(message, Err);
    const m = Buffer.isBuffer(message) ? message.toString('utf8') : message;
    return JSON.parse(m);
}

export function validateMethod(methodName: string, registeredMethods: Map<string, Method>, Err: E<Error>): Method {
    const method = registeredMethods.get(methodName);
    if (!method) throw new Err(`Method with name '${methodName}' could not be found.`);
    return method;
}

export function validateParams(
    providedParams: Params | MethodArgs | undefined,
    expectedParams: Params,
    Err: E<Error>,
): MethodArgs {
    const expectedParamsKeys: Array<string> = Object.keys(expectedParams);

    let providedParamsLength = 0;
    let providedParamsKeys = [];

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