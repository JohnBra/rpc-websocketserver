import { HandlerResult, MessageHandler, Method } from '../interfaces';
import { assertValidRequest, parseRequest, validateMethod, validateParams } from '../utils';
import { NOOP } from '../constants';

class SimpleMessageHandler implements MessageHandler {
    handle(message: string, methods: Map<string, Method>): HandlerResult {
        const res: HandlerResult = { error: true, data: undefined, func: NOOP, args: [] };

        try {
            const req = parseRequest(message, Error);
            assertValidRequest(req, Error);
            const method = validateMethod(req.method, methods, Error);
            res.args = validateParams(req?.params, method.params, Error);
            res.func = method.func;
            res.error = false;
        } catch (err) {
            res.data = err.message;
        }

        return res;
    }

    async process(handlerResult: HandlerResult): Promise<any> {
        let response;
        if (!handlerResult.error) {
            try {
                response = await handlerResult.func(...handlerResult.args);
            } catch (err) {
                console.log(err);
            }
        } else {
            response = handlerResult.data;
        }

        return response;
    }
}

export default SimpleMessageHandler;
