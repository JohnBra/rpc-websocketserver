import 'reflect-metadata';
import { Method, Params } from './interfaces';

export const PARAM_NAMES_KEY = Symbol('__paramNames__');

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

// TODO add limitations of parameters to readme (no type checking implemented)
export function param(name: string): Function {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        const paramNames = Reflect.getOwnMetadata(PARAM_NAMES_KEY, target, propertyKey) || [];

        paramNames[parameterIndex] = name;

        Reflect.defineMetadata(PARAM_NAMES_KEY, paramNames, target, propertyKey);
    };
}
