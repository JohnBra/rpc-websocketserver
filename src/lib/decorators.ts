import 'reflect-metadata';
import { Method, Params } from './message-handling/interfaces';

const PARAMETER_NAME_KEY = Symbol('parameterName');

export function register(methodName?: string) {
    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
        const paramNames: Array<string> = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];
        // param types are being added but not checked -> maybe checked in the future
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
export function param(name: string) {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number): void {
        const paramNames = Reflect.getOwnMetadata(PARAMETER_NAME_KEY, target, propertyKey) || [];

        paramNames[parameterIndex] = name;

        Reflect.defineMetadata(PARAMETER_NAME_KEY, paramNames, target, propertyKey);
    };
}
