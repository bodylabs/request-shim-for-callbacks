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

var should = require('should');

var verifyResponseStatus = require('./request-shim-for-callbacks');

describe('verifyResponseStatus', function () {

    context('a JSON response', function () {

        context('containing a successful response', function () {
            var data = { foo: 'bar' };

            it('should return the document as the error', function (done) {
                var callback = verifyResponseStatus(200, function (err, response) {
                    should(err).equal(null);

                    response.should.equal(data);

                    done();
                });

                var error = null,
                    response = { statusCode: 200 },
                    body = data;

                callback(error, response, body);
            });
        });

        context('with an unexpected status, and no `message` property', function () {
            var errorBody = JSON.stringify({ foo: 'bar' });

            it('should return the entire body as the error', function (done) {
                var callback = verifyResponseStatus(200, function (err, response) {
                    err.toString().should.equal('Error: 400 ' + errorBody);

                    done();
                });

                var error = null,
                    response = { statusCode: 400 },
                    body = errorBody;

                callback(error, response, body);
            });
        });

        context('with an unexpected status, and a `message` property', function () {
            var errorBody = { message: 'This is the message' };

            it('should return the message as the error', function (done) {
                var callback = verifyResponseStatus(200, function (err, response) {
                    err.toString().should.equal('Error: 400 ' + errorBody.message);

                    done();
                });

                var error = null,
                    response = { statusCode: 400 },
                    body = errorBody;

                callback(error, response, body);
            });
        });

    });

    context('an HTML response', function () {
        var html = '<!DOCTYPE html>\n<html><head></head><body></body></html>';

        it('should return the document as the error', function (done) {
            var callback = verifyResponseStatus(200, function (err, response) {
                err.toString().should.equal('Error: 500 ' + html);

                done();
            });

            var error = null,
                response = { statusCode: 500 },
                body = html;

            callback(error, response, body);
        });
    });

    context('an undefined body', function () {
        // This test case is to keep this working well with `nock`, which
        // can sends an undefined response.

        it('should return an error', function (done) {
            var callback = verifyResponseStatus(200, function (err, response) {
                err.should.be.ok();

                done();
            });

            var error = Error('Something went wrong'),
                response = { statusCode: 400 },
                body = undefined;

            callback(error, response, body);
        });
    });
});
