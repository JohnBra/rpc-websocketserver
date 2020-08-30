import { WebSocketServer } from './lib/websocket-server';
import { register, param } from './lib/decorators';
import {
    assertStringOrBuffer,
    validateAndParseMessage,
    assertValidRequest,
    validateParams,
    validateMethod,
} from './lib/utils';
import { MessageHandler, Params, Method, MethodArgs, HandlerResult, Request } from './lib/interfaces';
import { assertValidJSONRPC2Request, buildResponse, buildError } from './lib/json-rpc-2/utils';
import SimpleMessageHandler from './lib/message-handlers/simple';
import JSONRPC2MessageHandler from './lib/message-handlers/json-rpc-2';

export {
    WebSocketServer,
    register,
    param,
    assertStringOrBuffer,
    validateAndParseMessage,
    assertValidRequest,
    validateParams,
    validateMethod,
    MessageHandler,
    Params,
    Method,
    MethodArgs,
    HandlerResult,
    Request,
    assertValidJSONRPC2Request,
    buildResponse,
    buildError,
    SimpleMessageHandler,
    JSONRPC2MessageHandler,
};
