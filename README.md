# object-wrapper
> Wraps all of an object's functions in a wrapper of your choosing.

### Examples

Wrap the [`assert`](https://github.com/defunctzombie/commonjs-assert) library to appropriately throw exceptions through the [Mocha](https://mochajs.org/) test runner:

```{js}
var wrapper = require('object-wrapper');
var mocha = require('mocha');
var assert = wrapper(require('assert'), function (fcnInfo, args) {
    try {
        fcnInfo.originalFcn.apply(fcnInfo.namespace, args);
    } catch (e) {
        mocha.throwError(e);
    }
}, 'assert' /* Name to use for root object in fcnInfo objects */, true /* Attach wrappers to original object */);
```

### Limitations

Currently limited to wrapping objects without prototypes, and functions that are not constructors.
These limitations are not unsurmountable, and may be addressed in a future update (and I welcome PRs!).
