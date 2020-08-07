import * as WebSocket from 'ws';
import { HandlerResult, MessageHandler, Method, ValidationResult } from '../interfaces';
import { assertValidRequest, validateAndParseMessage, validateMethod, validateParams } from '../utils';
import { NOOP } from '../constants';

class SimpleMessageHandler implements MessageHandler {
    handle(message: string | Buffer, registeredMethods: Map<string, Method>): HandlerResult {
        const handlerResult: HandlerResult = { error: true, data: 'Internal server error', ctx: undefined };
        try {
            const request = validateAndParseMessage(message, Error);
            assertValidRequest(request, Error);
            const validationResult: ValidationResult = { error: true, data: undefined, func: NOOP, args: [] };
            const method = validateMethod(request.method, registeredMethods, Error);
            validationResult.args = validateParams(request?.params, method.params, Error);
            validationResult.func = method.func;
            validationResult.error = false;
            handlerResult.ctx = validationResult;
            handlerResult.error = false;
        } catch (err) {
            handlerResult.data = err.message;
        }
        return handlerResult;
    }

    async process(handlerResult: HandlerResult): Promise<WebSocket.Data> {
        let response;
        if (handlerResult.ctx && !Array.isArray(handlerResult.ctx)) {
            if (!handlerResult.ctx.error) {
                try {
                    response =  await handlerResult.ctx.func(...handlerResult.ctx.args);
                } catch (err) {
                    console.log(err);
                    response = 'Internal server error';
                }
            } else {
                response = handlerResult.ctx.data;
            }
        }
        return response;
    }
}

export default SimpleMessageHandler;
