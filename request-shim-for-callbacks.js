// Copyright (c) 2016, Body Labs, Inc.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
// 1. Redistributions of source code must retain the above copyright
// notice, this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright
// notice, this list of conditions and the following disclaimer in the
// documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
// OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
// AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
// WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.

var _ = require('underscore'),
    util = require('util');

// Wrap `request`'s idiosyncratic callback format with a standard Node-style
// callback. Consider any status code not matching the expected status an
// error.
//
// Copy-paste from `bodylabs-api-client`, but should be replaced with a
// promise-based interface when we switch to promises.
//
var verifyResponseStatus = function (expectedStatusCode, callback) {
    return function (error, response, body) {
        if (error) {
            callback(error, null);
        } else if (response.statusCode !== expectedStatusCode) {


            var message =
                util.format('%d%s%s',
                            response.statusCode,
                            (response.statusMessage || '') + ' ',

                            // Use the `abody`'s message if is exists
                            _(body).has('message') ? body.message : body || ''
                           ).trim();

            callback(Error(message), null);
        } else {
            callback(null, body);
        }
    };
};

module.exports = verifyResponseStatus;
