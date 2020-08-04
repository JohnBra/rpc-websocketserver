import { NOOP } from '../constants';
import { Method, MessageHandler, HandlerResult } from '../interfaces';
import { parseRequest, validateMethod, validateParams } from '../utils';
import { assertValidJSONRPC2Request, buildResponse } from '../json-rpc-2/utils';
import { InternalError, InvalidMethod, InvalidParams, InvalidRequest, ParseError } from '../json-rpc-2/errors';

class JSONRPC2MessageHandler implements MessageHandler {
    handle(message: string | Buffer, methods: Map<string, Method>): HandlerResult {
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
            const request = parseRequest(message, ParseError);
            assertValidJSONRPC2Request(request, InvalidRequest);
            // set request as data
            res.data.request = request;
            const method = validateMethod(request.method, methods, InvalidMethod);
            res.func = method.func;
            res.args = validateParams(request?.params, method.params, InvalidParams);
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
                jsonRpc2Response = buildResponse(true, requestId, new InternalError().object);
            }
        } else {
            jsonRpc2Response = buildResponse(true, requestId, handlerResult.data.errorDetails);
        }

        if (jsonRpc2Response) jsonRpc2Response = JSON.stringify(jsonRpc2Response);

        return jsonRpc2Response;
    }
}

export default JSONRPC2MessageHandler;
