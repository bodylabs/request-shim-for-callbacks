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
            var errorObject = { foo: 'bar' };

            it('should return the entire body as the error', function (done) {
                var callback = verifyResponseStatus(200, function (err, response) {
                    err.toString().should.equal('Error: ' + errorObject.toString());

                    done();
                });

                var error = null,
                    response = { statusCode: 400 },
                    body = errorObject;

                callback(error, response, body);
            });
        });

        context('with an unexpected status, and a `message` property', function () {
            var errorObject = { message: 'This is the message' };

            it('should return the message as the error', function (done) {
                var callback = verifyResponseStatus(200, function (err, response) {
                    err.toString().should.equal('Error: ' + errorObject.message);

                    done();
                });

                var error = null,
                    response = { statusCode: 400 },
                    body = errorObject;

                callback(error, response, body);
            });
        });

    });

    context('an HTML response', function () {
        var html = '<!DOCTYPE html>\n<html><head></head><body></body></html>';

        it('should return the document as the error', function (done) {
            var callback = verifyResponseStatus(200, function (err, response) {
                err.toString().should.equal('Error: ' + html);

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
                err.should.be.ok;

                done();
            });

            var error = Error('Something went wrong'),
                response = { statusCode: 400 },
                body = undefined;

            callback(error, response, body);
        });
    });
});
