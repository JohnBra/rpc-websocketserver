import { Method, Params } from './message-handler';

export const NOOP = (): void => {};
export const EMPTY_PARAMS: Params = {};
export const EMPTY_METHOD: Method = { namespace: '', name: '', params: EMPTY_PARAMS, func: NOOP };
