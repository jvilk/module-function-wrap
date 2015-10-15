/**
 * Contains information about the function.
 */
interface IFunctionInfo {
    // The namespace of the function, e.g. Dropbox.Client
    namespace: any;
    // The name of the namespace, e.g. "Dropbox.Client"
    namespaceName: string;
    // The original function, e.g. "Dropbox.Client.readFile"
    originalFcn: any;
    // The original function name, e.g. "readFile".
    originalFcnName: string;
}

export = function wrapObject(obj: any, wrapper: (functionInfo: IFunctionInfo, args: IArguments) => void, objName: string = 'root', modifyObj: boolean = false): any {
    if (typeof(obj) !== 'object') {
        throw new Error(`Erroneous argument of type ${typeof(obj)}. object-wrapper only wraps objects.`);
    }
    var wrappedObj: any = modifyObj ? obj : {};
    // Avoid items on the prototype.
    Object.keys(obj).forEach(function(name) {
        var funcInfo: IFunctionInfo = {
            namespace: obj,
            namespaceName: objName,
            originalFcn: obj[name],
            originalFcnName: name
        };
        wrappedObj[name] = function() {
            wrapper(funcInfo, arguments);
        };
    });
    return wrappedObj;
};
