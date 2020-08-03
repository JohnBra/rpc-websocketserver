import { Method, Params } from './interfaces';

/* istanbul ignore next */
export const NOOP = (): void => {};

export const EMPTY_PARAMS: Params = {};
export const EMPTY_METHOD: Method = { namespace: '', name: '', params: EMPTY_PARAMS, func: NOOP };
