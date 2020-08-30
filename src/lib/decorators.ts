import 'reflect-metadata';
import { Method, Params } from './interfaces';

/**
 * Symbol to be appended to function metadata
 */
export const PARAM_NAMES_KEY = Symbol('__paramNames__');

/**
 * Decorator factory to register a function to a namespace
 *
 * @param methodName {string} - optional parameter to rename the function name to the provided string
 */
export function register(methodName?: string): Function {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
        const paramNames: Array<string> = Reflect.getOwnMetadata(PARAM_NAMES_KEY, target, propertyKey) || [];
        const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];

        const params: Params = {};
        if (paramNames.length === paramTypes.length) {
            for (let i = 0; i < paramNames.length; i++) {
                if (typeof paramTypes[i].name === 'string') params[paramNames[i]] = paramTypes[i].name.toLowerCase();
            }
        }

        const functionName: string = typeof propertyKey === 'string' ? propertyKey : propertyKey.toString();

        const method: Method = {
            namespace: target.constructor.name,
            name: methodName || functionName,
            func: target[propertyKey],
            params,
        };

        target.constructor.methods.add(method);
    };
}

/**
 * Decorator factory to expose function parameter to registered method
 *
 * @param name {string} - associated name for param index
 */
export function param(name: string): Function {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        // TODO add limitations of parameters to readme (no type checking implemented)
        const paramNames = Reflect.getOwnMetadata(PARAM_NAMES_KEY, target, propertyKey) || [];

        paramNames[parameterIndex] = name;

        Reflect.defineMetadata(PARAM_NAMES_KEY, paramNames, target, propertyKey);
    };
}
