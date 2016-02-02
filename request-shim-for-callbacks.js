var _ = require('underscore');

// Wrap `request`'s idiosyncratic callback format with a standard Node-style
// callback. Consider any status code not matching the expected status an
// error.
//
// Copy-paste from `bodylabs-api-client`, but should be replaced with a
// promise-based interface when we switch to promises.
//
var verifyResponseStatus = module.exports = function (expectedStatusCode, callback) {
    return function (error, response, body) {
        if (error) {
            callback(error, null);
        } else if (response.statusCode != expectedStatusCode) {
            // When `body` is a string or undefined, `_.has` will return
            // `false`.
            var message = _(body).has('message') ? body.message : body;

            callback(Error(message), null);
        } else {
            callback(null, body);
        }
    };
};
