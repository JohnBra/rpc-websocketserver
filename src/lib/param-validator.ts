import { Params } from './message-handler';

export interface ParamValidatorResult {
    error: boolean;
    errorMessage: string;
    methodArgs: Array<any>;
}

export function validateParams(providedParams: Params | Array<any>, expectedParams: Params): ParamValidatorResult {
    const res: ParamValidatorResult = { error: true, errorMessage: '', methodArgs: [] };
    const expectedParamsKeys: Array<string> = Object.keys(expectedParams);

    if (Array.isArray(providedParams)) {
        if (providedParams.length !== expectedParamsKeys.length) {
            res.errorMessage = `Expected ${expectedParamsKeys.length} params. Received ${providedParams.length}.`;
            return res;
        }
    } else if (typeof providedParams === 'object' && providedParams !== null) {
        const providedParamsKeys = Object.keys(providedParams);
        if (providedParamsKeys.length !== expectedParamsKeys.length) {
            res.errorMessage = `Expected ${expectedParamsKeys.length} params. Received ${providedParamsKeys.length}.`;
            return res;
        }

        for (let i = 0; i < expectedParamsKeys.length; i++) {
            if (!providedParams.hasOwnProperty(expectedParamsKeys[i])) {
                res.errorMessage = `Params must include '${expectedParamsKeys[i]}'`;
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
            const p: any = providedParams[expectedParamsKeys[i]];
            res.methodArgs.push(p);
        }
    } else {
        res.methodArgs = providedParams;
    }
    return res;
}
