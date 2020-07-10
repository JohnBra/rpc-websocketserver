import { Method } from './message-handler';

export interface MethodValidatorResult {
    error: boolean;
    errorMessage: string;
    method: Method;
}

export function validateMethod(methodName: string, registeredMethods: Array<Method>): MethodValidatorResult {
    const res = { error: true, errorMessage: '', method: undefined };
    for (let i = 0; i < registeredMethods.length; i++) {
        if (methodName === registeredMethods[i].method) {
            res.error = false;
            res.method = registeredMethods[i];
            return res;
        }
    }

    res.errorMessage = `Method with name '${methodName}' could not be found.`;
    return res;
}
