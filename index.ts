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

export = function wrapModule(wrapper: (thisArg: any, originalFcn: any, )) {

};