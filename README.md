request-shim-for-callbacks
==========================

Wrap `request`'s idiosyncratic callback format with a standard Node-style
callback.

Consider any status code not matching the expected status an error.

Usage
-----

```
var request = require('request'),
    verifyResponseStatus = require('./request-shim-for-callbacks');

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
