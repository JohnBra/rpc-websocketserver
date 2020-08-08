import * as WebSocket from 'ws';
import { HandlerResult, MessageHandler, Method } from '../interfaces';
import { assertValidRequest, validateAndParseMessage, validateMethod, validateParams } from '../utils';
import { NOOP } from '../constants';

class SimpleMessageHandler implements MessageHandler {
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

    async process(handlerResult: HandlerResult): Promise<WebSocket.Data> {
        const { error, data, func, args } = handlerResult;
        let response;
        if (!error) {
            try {
                response =  await func(...args);
            } catch (err) {
                console.log(err);
                response = 'Internal server error';
            }
        } else {
            response = data;
        }
        if (response) response = JSON.stringify(response);

        return response;
    }
}

export default SimpleMessageHandler;
