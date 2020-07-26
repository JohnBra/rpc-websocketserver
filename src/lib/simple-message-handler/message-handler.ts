import { HandlerResult, MessageHandler, Method, Params } from '../message-handler';
import { MethodValidatorResult, validateMethod } from '../method-validator';
import { ParamValidatorResult, validateParams } from '../param-validator';
import { NOOP } from '../constants';

class SimpleMessageHandler implements MessageHandler {
    handle(message: string, methods: Map<string, Method>): HandlerResult {
        const res: HandlerResult = {
            error: true,
            data: undefined,
            func: NOOP,
            args: [],
        };

        try {
            const req = JSON.parse(message);
            const method = SimpleMessageHandler._validateMethod(req.method, methods);
            res.args = SimpleMessageHandler._validateParams(req.params, method.params);
            res.func = method.func;
            res.error = false;
        } catch (err) {
            res.data = err.message;
        }

        return res;
    }

    process(handlerResult: HandlerResult): any {
        let response;
        if (!handlerResult.error) {
            try {
                response = handlerResult.func(...handlerResult.args);
            } catch (err) {
                console.log(err);
            }
        } else {
            response = handlerResult.data;
        }

        return response;
    }

    private static _validateMethod(methodName: string, registeredMethods: Map<string, Method>): Method {
        const validatorResult: MethodValidatorResult = validateMethod(methodName, registeredMethods);

        if (validatorResult.error) throw new Error(validatorResult.errorMessage);
        return validatorResult.method;
    }

    private static _validateParams(providedParams: object | Array<any>, expectedParams: Params): Array<any> {
        const validatorResult: ParamValidatorResult = validateParams(providedParams, expectedParams);

        if (validatorResult.error) throw new Error(validatorResult.errorMessage);
        return validatorResult.methodArgs;
    }
}

export default SimpleMessageHandler;
