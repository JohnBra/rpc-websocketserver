import { Params, Method, MessageHandler, HandlerResult } from '../interfaces';
import { validateMethod, validateParams } from '../utils';
import { NOOP } from '../constants';
import { assertValidRequest, buildError, buildResponse } from '../jsonrpc2/utils';
import { Request } from '../jsonrpc2/interfaces';
import { InvalidMethod, InvalidParams, ParseError } from '../jsonrpc2/errors';

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
            res.data.errorDetails = err?.object;
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
                if (!isNotification) jsonRpc2Response = buildResponse(false, requestId, executionResult);
            } catch (err) {
                // catch internal server error on execution failure + build json rpc 2 response
                jsonRpc2Response = buildResponse(true, requestId, buildError(-32603));
            }
        } else {
            jsonRpc2Response = buildResponse(true, requestId, handlerResult.data.errorDetails);
        }

        if (jsonRpc2Response) jsonRpc2Response = JSON.stringify(jsonRpc2Response);

        return jsonRpc2Response;
    }

    // TODO accept string, Buffer, ArrayBuffer, Buffer[]
    static parse(message: string): Request {
        try {
            return JSON.parse(message);
        } catch (err) {
            throw new ParseError(err.message);
        }
    }

    static validateRequest(request: object): Request {
        assertValidRequest(request);

        const paramsOmitted = !request.hasOwnProperty('params');
        const isNotification = !request.hasOwnProperty('id');

        const res: Request = {
            jsonrpc: request.jsonrpc,
            method: request.method,
            params: paramsOmitted ? {} : request.params,
        };

        if (!isNotification) res.id = request.id;

        return res;
    }

    static validateMethod(methodName: string, registeredMethods: Map<string, Method>): Method {
        return validateMethod(methodName, registeredMethods, InvalidMethod);
    }

    static validateParams(providedParams: object | Array<any>, expectedParams: Params): Array<any> {
        return validateParams(providedParams, expectedParams, InvalidParams);
    }
}

export default JSONRPC2MessageHandler;
