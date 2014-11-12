'use strict';

var assert = require('assert'),
    connectionTester = require('..');

var publicAPIS = require('./fixtures/public-apis'),
    sampleStage = require('./fixtures/sample-stage-apis');

describe('Service Configurator with no config', function () {

    it('public apis', function (next) {

        connectionTester.test(null, publicAPIS, function (err, results) {
            assert.ok(results);
            assert.ok(results.length > 1);
            next();
        });

    });

    it('sample stage apis', function (next) {

        connectionTester.test(null, sampleStage, function (err, results) {
            assert.ok(results);
            next();
        });

    });
});


describe('Service Configurator with config', function () {

    var config = {
        showcolors: false,
        showOnlyErrors: true
    };
    it('public apis', function (next) {

        connectionTester.test(config, publicAPIS, function (err, results) {
            assert.ok(results);
            assert.ok(results.length === 0);
            next();
        });

    });

    it('sample stage apis', function (next) {

        connectionTester.test(config, sampleStage, function (err, results) {
            assert.ok(results);
            next();
        });

    });
});