import 'reflect-metadata';
import { Method, Params } from './message-handler';

const PARAMETER_NAME_KEY = Symbol('parameterName');

export function register(methodName?: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const paramNames: Array<string> = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];
        const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];

        const params: Params = {};
        if (paramNames.length === paramTypes.length) {
            for (let i = 0; i < paramNames.length; i++) {
                if (typeof paramTypes[i].name === 'string') params[paramNames[i]] = paramTypes[i].name.toLowerCase();
            }
        }

        const method: Method = {
            namespace: target.constructor.name,
            method: methodName || propertyKey,
            func: target[propertyKey],
            params,
        };

        target.constructor.methods.push(method);
    };
}

// TODO add limitations of parameters to readme (any type will be object..., no deep param type checking implemented)
export function param(name: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const paramNames = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];

        paramNames[parameterIndex] = name;

        Reflect.defineMetadata(PARAMETER_NAME_KEY, paramNames, target, propertyKey);
    };
}