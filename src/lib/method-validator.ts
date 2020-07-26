import { Method } from './message-handler';
import { EMPTY_METHOD } from './constants';

export interface MethodValidatorResult {
    error: boolean;
    errorMessage: string;
    method: Method;
}

export function validateMethod(methodName: string, registeredMethods: Map<string, Method>): MethodValidatorResult {
    const method = registeredMethods.get(methodName);
    if (method) return { error: false, errorMessage: '', method: method };

    return {
        error: true,
        errorMessage: `Method with name '${methodName}' could not be found.`,
        method: EMPTY_METHOD
    };
}
