# object-wrapper v0.1.0
> Wraps all of an object's functions in a wrapper of your choosing.

### API

The `object-wrapper` package is a single function that returns the wrapped object:

```{js}
wrapper(object, wrapFcn, objectName, shouldAttachWrappersToObject);
```

The options to this function are as follows:

* **object: Object | Function**: The object (or function) that should be wrapped.
* **wrapFcn: Function**: A function invoked each time a wrapped function is run. It receives the following arguments:
  * **functionInfo: Object**: An object literal with the following fields:
    * **namespace: Object**: An object representing the namespace of the function, e.g. Dropbox.Client
    * **namespaceName: String**: A string name for the namespace of the function, e.g. "Dropbox.Client"
    * **originalFcn: Function**: The original, non-wrapped function, e.g. Dropbox.Client.readFile
    * **originalFcnName: String**: The original function name, e.g. "readFile";
  * **args: Arguments object**: The arguments passed to the function.
  * **isConstructor: Boolean**: True if the function was called with the `new` keyword, false otherwise.
  * **callingFcn: Function**: The caller of your wrapping function. Useful if you wish to trim stack traces passing through your wrapper.
* (Optional) **objectName: String**: The name for the object, e.g. "Dropbox". Used to construct "namespaceName".
* (Optional) **shouldAttachWrappersToObject: Boolean**: Determines if wrapper should return a new object, or place wrappers on the original object. Defaults to false.

The function returns the wrapped object.

### Examples

Wrap the [`assert`](https://github.com/defunctzombie/commonjs-assert) library to appropriately throw exceptions through the [Mocha](https://mochajs.org/) test runner:

```{js}
var wrapper = require('object-wrapper');
var mocha = require('mocha');
// Permits calling a constructor via fcn.apply.
function construct(constructor, args) {
    function F() : void {
        constructor.apply(this, args);
    }
    F.prototype = constructor.prototype;
    return new F();
}
var wrappedAssert = wrapper(require('assert'), function (fcnInfo, args, isConstructor) {
    try {
        if (!isConstructor) {
            return funcInfo.originalFcn.apply(funcInfo.namespace, args);
        } else {
            // Wrapped function called as a constructor. For the assert library, this occurs when
            // new assert.AssertionError objects are constructed.
            return construct(funcInfo.originalFcn, args);
        }
    } catch (e) {
        mocha.throwError(e);
    }
  }
}, 'assert' /* Name to use for root object in fcnInfo objects */);
```

### Limitations

Currently limited to wrapping objects without prototypes, and functions that are not constructors.
These limitations are not unsurmountable, and may be addressed in a future update (and I welcome PRs!).
