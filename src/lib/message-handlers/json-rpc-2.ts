import WebSocket from 'ws';
import { NOOP } from '../constants';
import { Method, MessageHandler, HandlerResult } from '../interfaces';
import { validateAndParseMessage, validateMethod, validateParams } from '../utils';
import { assertValidJSONRPC2Request, buildResponse } from '../json-rpc-2/utils';
import { InternalError, InvalidMethod, InvalidParams, InvalidRequest, ParseError } from '../json-rpc-2/errors';

/**
 * JSON RPC 2 conform message handler
 *
 * @implements {MessageHandler}
 */
class JSONRPC2MessageHandler implements MessageHandler {
    /**
     * Handles an incoming message conforming to the JSON RPC 2 protocol
     *
     * @param message {string | Buffer} - message to be parsed, validated and evaluated
     * @param registeredMethods {Map<string, Method>} - registered namespace methods
     * @returns {HandlerResult} - result object to be processed
     */
    handle(message: string | Buffer, registeredMethods: Map<string, Method>): HandlerResult {
        const res: HandlerResult = {
            error: true,
            data: {},
            func: NOOP,
            args: [],
        };

        try {
            const request = validateAndParseMessage(message, ParseError);
            assertValidJSONRPC2Request(request, InvalidRequest);
            if (Object(request).hasOwnProperty('id')) res.data.requestId = request.id;
            const method = validateMethod(request.method, registeredMethods, InvalidMethod);
            res.func = method.func;
            res.args = validateParams(request?.params, method.params, InvalidParams);
            res.error = false;
        } catch (err) {
            // set json rpc 2 error as res
            res.data.errorDetails = err?.object;
        }
        return res;
    }

    /**
     * Function to process handler result. Should call rpc and return a JSON RPC 2 conform response
     *
     * @param context {any} - context of the calling class to properly handle 'this' in the function call
     * @param handlerResult {HandlerResult} - handler result from same message handler
     * @returns {Promise<WebSocket.Data | undefined>}
     */
    async process(context: any, handlerResult: HandlerResult): Promise<WebSocket.Data | undefined> {
        const { error, data, func, args } = handlerResult;
        const isNotification = !data.hasOwnProperty('requestId');
        const requestId = handlerResult.data.requestId ?? null;

        let jsonRpc2Response;
        if (!error) {
            try {
                const executionResult = await func.call(context, ...args);
                // only build response if request wasn't a notification
                if (!isNotification) jsonRpc2Response = buildResponse(false, requestId, executionResult);
            } catch (err) {
                // catch internal server error on execution failure + build json rpc 2 response
                jsonRpc2Response = buildResponse(true, requestId, new InternalError().object);
            }
        } else {
            jsonRpc2Response = buildResponse(true, requestId, data.errorDetails);
        }

        if (jsonRpc2Response) jsonRpc2Response = JSON.stringify(jsonRpc2Response);
        return jsonRpc2Response;
    }
}

export default JSONRPC2MessageHandler;
