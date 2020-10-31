import WebSocket from 'ws';
import { HandlerResult, MessageHandler, Method } from '../interfaces';
import { assertValidRequest, validateAndParseMessage, validateMethod, validateParams } from '../utils';
import { NOOP } from '../constants';

/**
 * Minimalist message handler
 *
 * @implements {MessageHandler}
 */
class SimpleMessageHandler implements MessageHandler {

    /**
     * Handles an incoming message
     *
     * @param message {string | Buffer} - message to be parsed, validated and evaluated
     * @param registeredMethods {Map<string, Method>} - registered namespace methods
     * @returns {HandlerResult} - result object to be processed
     */
    handle(message: string | Buffer, registeredMethods: Map<string, Method>): HandlerResult {
        const handlerResult: HandlerResult = { error: true, data: undefined, func: NOOP, args: [] };
        try {
            const request = validateAndParseMessage(message, Error);
            assertValidRequest(request, Error);
            const method = validateMethod(request.method, registeredMethods, Error);
            handlerResult.args = validateParams(request?.params, method.params, Error);
            handlerResult.func = method.func;
            handlerResult.error = false;
        } catch (err) {
            handlerResult.data = err.message;
        }
        return handlerResult;
    }

    /**
     * Function to process handler result. Should call rpc and return data to be sent to clients
     *
     * @param context {any} - context of the calling class to properly handle 'this' in the function call
     * @param handlerResult {HandlerResult} - handler result from same message handler
     * @returns {Promise<WebSocket.Data | undefined>}
     */
    async process(context: any, handlerResult: HandlerResult): Promise<WebSocket.Data | undefined> {
        const { error, data, func, args } = handlerResult;
        let response;
        if (!error) {
            try {
                response = await func.call(context, ...args);
            } catch (err) {
                console.log(err);
                response = 'Internal server error';
            }
        } else {
            response = data;
        }
        if (response && typeof response !== 'string') response = JSON.stringify(response);

        return response;
    }
}

export default SimpleMessageHandler;
