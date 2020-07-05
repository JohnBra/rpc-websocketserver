import { Method, MessageHandler, HandlerResult } from "../message-handler";
import { errors, JSONRPC2Request, JSONRPC2Response, JSONRPC2Error, JSONRPC2Id } from "./utils";
import { MethodValidatorResult, validateMethod } from "../method-validator";
import { ParamValidatorResult, validateParams } from "../param-validator";

export class JSONRPC2MessageHandler implements MessageHandler {
    handle(message: any, methods: Array<Method>): HandlerResult {
        const res: HandlerResult = {
            error: true,
            message: JSONRPC2MessageHandler.buildError(-32603),   // internal error object as default
            func: () => {},
            args: [],
        };

        try {
            const messageObject = this.parse(message);
            const request = this.validateRequest(messageObject);
            const method = this.validateMethod(request.method, methods);
            const methodArgs = this.validateParams(request.params, method.params);
            res.func = method.func;
            res.args = methodArgs;
            res.message = 'Success';
            res.error = false;
        } catch (err) {
            res.message = err.message;
        }
        return res;
    }

    private parse(message: string): JSONRPC2Request {
        try {
            return JSON.parse(message);
        } catch (err) {
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(-32700)));
        }
    }

    private validateRequest(request: JSONRPC2Request): JSONRPC2Request {
        const missingProperties: Array<string> = [];
        let paramsOmitted = true;
        let idOmitted = true;

        if (!request.hasOwnProperty('jsonrpc')) {
            missingProperties.push('jsonrpc');
        } else if (request.jsonrpc !== '2.0')
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(
                -32600, `Value of 'jsonrpc' must be exactly "2.0"`
            )));
        if (!request.hasOwnProperty('method')) {
            missingProperties.push('method');
        } else if (typeof request.method !== 'string') {
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(
                -32600, `Value of 'method' must be of type 'string'`
            )));
        }
        if (request.hasOwnProperty('params')) {
            paramsOmitted = false;
            if (!Array.isArray(request.params) && typeof request.params !== 'object') {
                throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(
                    -32600, `Value of 'params' must be of type 'array' or 'object'`
                )));
            }
        }
        if (request.hasOwnProperty('id')) {
            idOmitted = false;
            if (typeof request.id !== 'string' && typeof request.id !== 'number' && request.id !== null) {
                throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(
                    -32600, `Value of 'id' must be of type 'string', 'number', or have value 'null'`
                )));
            }
        }


        if (missingProperties.length)
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(
                -32600, `Missing properties in request object: ${missingProperties.join(', ')}`
            )));

        const res = {
            jsonrpc: request.jsonrpc,
            method: request.method,
            params: paramsOmitted ? {} : request.params
        };

        if (!idOmitted) res['id'] = request.id;

        return res;
    }

    private validateMethod(methodName: string, registeredMethods: Array<Method>): Method {
        const validatorResult: MethodValidatorResult = validateMethod(methodName, registeredMethods);

        if (validatorResult.error)
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(-32601, validatorResult.errorMessage)));
        return validatorResult.method;
    }

    private validateParams(providedParams: object | Array<any>, expectedParams: object): Array<any> {
        const validatorResult: ParamValidatorResult = validateParams(providedParams, expectedParams);

        if (validatorResult.error)
            throw new Error(JSON.stringify(JSONRPC2MessageHandler.buildError(-32602, validatorResult.errorMessage)));
        return validatorResult.methodArgs;
    }

    static buildResponse(id: JSONRPC2Id, result: any, error: JSONRPC2Error | null): JSONRPC2Response {
        const res = { jsonrpc: "2.0", result: result, id: id };
        const err = { jsonrpc: "2.0", error: error, id: id };
        if (result) {
            return res;
        } else {
            return err;
        }

    }

    static buildError(code: number, details?: string | object): JSONRPC2Error {
        const error: JSONRPC2Error = {
            code: code,
            message: errors.get(code) || "Internal Server Error"
        }

        if (details) error["data"] = details;

        return error;
    }
}
