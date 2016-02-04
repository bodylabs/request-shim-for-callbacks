request-shim-for-callbacks
==========================

Wrap `request`'s idiosyncratic callback format with a standard Node-style
callback.

Consider any status code not matching the expected status an error.


Usage
-----

```js
var request = require('request'),
    verifyResponseStatus = require('request-shim-for-callbacks');

request.get(
    {
        url: '/monitoring/raw',
        body: query,
    },
    verifyResponseStatus(200, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            console.log(data);

            callback(null, data);
        }
    })
);

```

Contribute
----------

- Issue Tracker: github.com/bodylabs/request-shim-for-callback/issues
- Source Code: github.com/bodylabs/request-shim-for-callbacks

Pull requests welcome!


License
-------

The project is licensed under the two-clause BSD license.
