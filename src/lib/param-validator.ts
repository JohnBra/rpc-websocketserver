import { Params } from './message-handler';

export interface ParamValidatorResult {
    error: boolean;
    errorMessage: string;
    methodArgs: Array<any>;
}

export function validateParams(providedParams: object | Array<any>, expectedParams: Params): ParamValidatorResult {
    const res: ParamValidatorResult = { error: true, errorMessage: '', methodArgs: [] };
    const expectedParamsKeys: Array<string> = Object.keys(expectedParams);

    if (Array.isArray(providedParams)) {
        if (providedParams.length !== expectedParamsKeys.length) {
            res.errorMessage = `Expected ${expectedParamsKeys.length} params. Got ${providedParams.length}.`;
            return res;
        }
        for (let i = 0; i < providedParams.length; i++) {
            if (typeof providedParams[i] !== expectedParams[expectedParamsKeys[i]]) {
                res.errorMessage = `Param on index ${i} must be of type '${expectedParams[expectedParamsKeys[i]]}'`;
                return res;
            }
        }
    } else if (typeof providedParams === 'object') {
        const providedParamsKeys = Object.keys(providedParams);
        if (providedParamsKeys.length !== expectedParamsKeys.length) {
            res.errorMessage = `Expected ${expectedParamsKeys.length} params. Got ${providedParamsKeys.length}.`;
            return res;
        }

        for (let i = 0; i < expectedParamsKeys.length; i++) {
            if (!providedParams.hasOwnProperty(expectedParamsKeys[i])) {
                res.errorMessage = `Params must include '${expectedParamsKeys[i]}'`;
                return res;
            }
            if (typeof providedParams[expectedParamsKeys[i]] !== expectedParams[expectedParamsKeys[i]]) {
                res.errorMessage = `Param '${expectedParamsKeys[i]}' must be of type '${
                    expectedParams[expectedParamsKeys[i]]
                }'`;
                return res;
            }
        }
    } else {
        res.errorMessage = "Params must be one of 'object' or 'array'";
        return res;
    }

    res.error = false;

    if (!Array.isArray(providedParams)) {
        for (let i = 0; i < expectedParamsKeys.length; i++) {
            res.methodArgs.push(providedParams[expectedParamsKeys[i]]);
        }
    } else {
        res.methodArgs = providedParams;
    }
    return res;
}
