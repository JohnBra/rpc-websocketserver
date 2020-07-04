import 'reflect-metadata';
import { Method } from './message-handler';

const PARAMETER_NAME_KEY = Symbol('parameterName');

export function register(methodName?: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const paramNames: Array<string> = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];
        const paramTypes: Array<any> = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];

        // a param has its name as key and its type as value
        const params = {};
        if (paramNames.length === paramTypes.length) {
            for (let i = 0; i < paramNames.length; i++) {
                if (typeof paramTypes[i].name === 'string') params[paramNames[i]] = paramTypes[i].name;
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

export function param(name: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        const paramNames = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];
        // TODO deep param type??
        paramNames[parameterIndex] = name;

        Reflect.defineMetadata(PARAMETER_NAME_KEY, paramNames, target, propertyKey);
    };
}
