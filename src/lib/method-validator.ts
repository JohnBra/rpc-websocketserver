import { Method } from './message-handler';
import { EMPTY_METHOD } from './constants';

export interface MethodValidatorResult {
    error: boolean;
    errorMessage: string;
    method: Method;
}

export function validateMethod(methodName: string, registeredMethods: Array<Method>): MethodValidatorResult {
    for (let i = 0; i < registeredMethods.length; i++) {
        if (methodName === registeredMethods[i].name) {
            return { error: false, errorMessage: '', method: registeredMethods[i] };
        }
    }

    return {
        error: true,
        errorMessage: `Method with name '${methodName}' could not be found.`,
        method: EMPTY_METHOD
    };
}
