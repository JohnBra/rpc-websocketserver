import {
    Params,
    Method,
    MessageHandler,
    MethodValidatorResult,
    ParamValidatorResult,
    HandlerResult
} from '../interfaces';
import { validateMethod } from '../method-validator';
import { validateParams } from '../param-validator';
import { NOOP } from '../../constants';
import {
    JSON_RPC_ERRORS,
    JSON_RPC_VERSION,
    JSONRPC2Request,
    JSONRPC2Response,
    JSONRPC2Error,
    JSONRPC2Id,
} from './interfaces';
import { InvalidMethod, InvalidParams, InvalidRequest, ParseError } from './errors';

class JSONRPC2MessageHandler implements MessageHandler {
    handle(message: string, methods: Map<string, Method>): HandlerResult {
        const res: HandlerResult = {
            error: true,
            data: {
                request: {},
                errorDetails: undefined,
            },
            func: NOOP,
            args: [],
        };

        try {
            const request = JSONRPC2MessageHandler.validateRequest(JSONRPC2MessageHandler.parse(message));
            // set request as data
            res.data.request = request;
            const method = JSONRPC2MessageHandler.validateMethod(request.method, methods);
            res.func = method.func;
            res.args = JSONRPC2MessageHandler.validateParams(request.params, method.params);
            res.error = false;
        } catch (err) {
            // set json rpc 2 error as data
            res.data.errorDetails = err.object();
        }
        return res;
    }

    async process(handlerResult: HandlerResult): Promise<any> {
        const isNotification = !handlerResult.data.request.hasOwnProperty('id');
        const requestId = handlerResult.data.request.id ?? null;

        let jsonRpc2Response;
        if (!handlerResult.error) {
            try {
                const executionResult = await handlerResult.func(...handlerResult.args);
                // only build response if request wasn't a notification
                if (!isNotification)
                    jsonRpc2Response = JSONRPC2MessageHandler.buildResponse(false, requestId, executionResult);
            } catch (err) {
                // catch internal server error on name execution failure + build proper json rpc 2 response
                const jsonRpc2Error = JSON.stringify(JSONRPC2MessageHandler.buildError(-32603));
                jsonRpc2Response = JSONRPC2MessageHandler.buildResponse(true, requestId, jsonRpc2Error);
            }
        } else {
            jsonRpc2Response = JSONRPC2MessageHandler.buildResponse(true, requestId, handlerResult.data.errorDetails);
        }

        if (jsonRpc2Response) jsonRpc2Response = JSON.stringify(jsonRpc2Response);

        return jsonRpc2Response;
    }

    // TODO accept string, Buffer, ArrayBuffer, Buffer[]
    static parse(message: string): JSONRPC2Request {
        try {
            return JSON.parse(message);
        } catch (err) {
            throw new ParseError();
        }
    }

    static validateRequest(request: JSONRPC2Request): JSONRPC2Request {
        let paramsOmitted = true;
        let isNotification = true;

        if (request?.jsonrpc !== JSON_RPC_VERSION)
            throw new InvalidRequest(`Value of 'jsonrpc' must be exactly '${JSON_RPC_VERSION}' and of type 'string'`);
        if (typeof request?.method !== 'string') {
            throw new InvalidRequest(`Value of 'method' must be of type 'string'`);
        }
        if (request.hasOwnProperty('params')) {
            paramsOmitted = false;
            if (!Array.isArray(request.params) && typeof request.params !== 'object') {
                throw new InvalidRequest(`Value of 'params' must be of type 'array' or 'object'`);
            }
        }
        if (request.hasOwnProperty('id')) {
            isNotification = false;
            if (typeof request.id !== 'string' && typeof request.id !== 'number' && request.id !== null) {
                throw new InvalidRequest(`Value of 'id' must be of type 'string', 'number', or of value 'null'`);
            }
        }

        const res: JSONRPC2Request = {
            jsonrpc: request.jsonrpc,
            method: request.method,
            params: paramsOmitted ? {} : request.params,
        };

        if (!isNotification) res.id = request.id;

        return res;
    }

    static validateMethod(methodName: string, registeredMethods: Map<string, Method>): Method {
        const validatorResult: MethodValidatorResult = validateMethod(methodName, registeredMethods);

        if (validatorResult.error) throw new InvalidMethod(validatorResult.errorMessage);
        return validatorResult.method;
    }

    static validateParams(providedParams: object | Array<any>, expectedParams: Params): Array<any> {
        const validatorResult: ParamValidatorResult = validateParams(providedParams, expectedParams);

        if (validatorResult.error) throw new InvalidParams(validatorResult.errorMessage);
        return validatorResult.methodArgs;
    }

    static buildResponse(error: boolean, id: JSONRPC2Id, data: any | JSONRPC2Error): JSONRPC2Response {
        if (error) return { jsonrpc: JSON_RPC_VERSION, error: data, id };
        return { jsonrpc: JSON_RPC_VERSION, result: data, id };
    }

    static buildError(code: number, details?: string | object): JSONRPC2Error {
        const error: JSONRPC2Error = {
            code,
            message: JSON_RPC_ERRORS.get(code) || 'Internal error',
        };

        if (details) error.data = details;

        return error;
    }
}

export default JSONRPC2MessageHandler;
