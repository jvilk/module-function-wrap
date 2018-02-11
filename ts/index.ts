import { IFunctionInfo } from "./interfaces";

export default function wrapObject(obj: any, wrapper: (functionInfo: IFunctionInfo, args: IArguments, isConstructor: boolean, callingFcn: Function) => any, objName: string = 'root', modifyObj: boolean = false): any {
    if (typeof(obj) !== 'object' && typeof(obj) !== 'function') {
        throw new Error(`Erroneous argument of type ${typeof(obj)}. object-wrapper only wraps objects or functions.`);
    }
    let wrappedObj: any = modifyObj ? obj : (typeof(obj) === 'function' ? function(this: any) {
        return wrapper({
            namespace: obj,
            namespaceName: objName,
            originalFcn: obj,
            originalFcnName: objName
        }, arguments, this instanceof wrappedObj, wrappedObj);
    } : {});
    // Avoid items on the prototype.
    Object.keys(obj).forEach(function(name) {
        if (typeof(obj[name]) === 'function') {
            var funcInfo: IFunctionInfo = {
                namespace: obj,
                namespaceName: objName,
                originalFcn: obj[name],
                originalFcnName: name
            };
            wrappedObj[name] = function(this: any) {
                return wrapper(funcInfo, arguments, this instanceof wrappedObj[name], wrappedObj[name]);
            };
        } else {
            wrappedObj[name] = obj[name];
        }
    });
    return wrappedObj;
};
