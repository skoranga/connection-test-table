'use strict';

var async = require('async'),
    colors = require('colors'),
    Table = require('easy-table'),
    connectionTester = require('connection-tester');


function extractHostPort(results, config, appConfig, modProp, packageName, callback) {
    var endPoint =  appConfig[modProp],
        ipport,
        ipportHP,
        testOutput,
        contest = {
            service: modProp
        };

    if (typeof endPoint === 'object') {
        contest.host = endPoint.hostname || endPoint.host || endPoint.ip;
        contest.port = endPoint.port;

        if (!contest.port) {
            if (endPoint.protocol && endPoint.protocol.indexOf('https') !== -1) {
                contest.port = 443;
            } else {
                contest.port = 80;
            }
        }
        if (contest.host) {
            connectionTester.test(contest.host, contest.port, function (err, testOutput) {
                contest.package = endPoint.package || packageName || '';
                if (config.showcolors) {
                    contest.success = testOutput.success === true ? '√'.green : 'X'.red;
                    contest.reason = testOutput.error ? colors.red(testOutput.error) : '';
                } else {
                    contest.success = testOutput.success === true ? '√' : 'X';
                    contest.reason = testOutput.error || '';
                }
                if (!config.showOnlyErrors || (config.showOnlyErrors && contest.reason)) {
                    results.push(contest);
                }
                callback();
            });
        } else {
            callback();
        }
    } else {
        callback();
    }
}

function normalizeConfig(config) {
    config = config || {};
    config.title = config.title || 'Service Connection Validator';
    config.showcolors = typeof config.showcolors !== 'undefined' ? !!config.showcolors : true;
    config.showOnlyErrors = typeof config.showOnlyErrors !== 'undefined' ? !!config.showOnlyErrors : false;

    if (config.showcolors) {
        config.title = config.title.grey.underline;
    }

    return config;
}

function printTable(config, results) {
    var t = new Table();

    results.forEach(function (contest) {
        t.cell('     ', '     ');
        t.cell('service', contest.service);
        t.cell('package', contest.package);
        t.cell('host', contest.host);
        t.cell('port', contest.port);
        t.cell('status', contest.success);
        t.cell('reason', contest.reason);
        t.newRow();
    });

    console.log('\n\t\t', config.title, '\n');
    console.log(t.toString());
    console.log();
}

module.exports = {
    test: function test(config, data, callback) {

        var results = [];
        config = normalizeConfig(config);

        data = data || {};

        async.map(Object.keys(data), function (appProp, cb) {

            var appConfig = data[appProp];
            if (typeof appConfig === 'object') {
                if (appConfig.host || appConfig.port) {
                    extractHostPort(results, config, data, appProp, null, cb);
                } else {
                    async.map(Object.keys(appConfig), function (modProp, cb1) {
                        extractHostPort(results, config, appConfig, modProp, appProp, cb1);
                    }, function () {
                        cb();
                    });
                }
            } else {
                cb();
            }
        }, function () {
            if (results.length > 0) {
                printTable(config, results);
            }
            callback && callback(null, results);
        });
    }
};