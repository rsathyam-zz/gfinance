var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');
var path = require('path');
var Stock = require('../lib/stock');

describe('Stock', function() {
    var stock = new Stock('AAPL');

    before(function(done) {
        fs.readFile(path.join(__dirname, 'aapl.html'), function (err, html) {
            stock.html = html;
            sinon.stub(stock, 'fetchData').yields(null, html);
            done();
        });
    });

    describe('#getSnapshotPrice()', function () {
        it('should return a valid price', function (done) {
            stock.getSnapshotPrice(function(err, res) {
                assert(err == null);
                assert(res == '94.48');
                done();
            });
        });
    });

    describe('#getDayRange()', function () {
        it('should return a valid day range', function (done) {
            stock.getDayRange(function(err, res) {
                if (err) throw err;
                assert(res.length == 2);
                assert(res[0] == '94.28');
                assert(res[1] == '96.04');
                done();
            });
        });
    });

    describe('#getYearRange()', function () {
        it('should return a valid year range', function (done) {
            stock.getYearRange(function(err, res) {
                if (err) throw err;
                assert(res.length == 2);
                assert(res[0] == '92');
                assert(res[1] == '134.54');
                done();
            });
        });
    });

    describe('#getOpenPrice()', function () {
        it('should return a valid open price', function (done) {
            stock.getOpenPrice(function(err, res) {
                if (err) throw err;
                assert(res == '95.42');
                done();
            });
        });
    });

    describe('#getMarketCap()', function () {
        it('should return a valid market cap', function (done) {
            stock.getMarketCap(function(err, res) {
                if (err) throw err;
                assert(res == '535.34B');
                done();
            });
        });
    });

    describe('#getPE()', function () {
        it('should return a valid p/e', function (done) {
            stock.getPE(function(err, res) {
                if (err) throw err;
                assert(res == '10.04');
                done();
            });
        });
    });

    describe('#getVolume()', function () {
        it('should return a valid volume', function (done) {
            stock.getVolume(function(err, res) {
                if (err) throw err;
                assert(res == '37.16M');
                done();
            });
        });
    });

    describe('#getAverageVolume()', function () {
        it('should return a valid average volume', function (done) {
            stock.getAverageVolume(function(err, res) {
                if (err) throw err;
                assert(res == '56.81M');
                done();
            });
        });
    });

    describe('#getLatestDividend()', function () {
        it('should return a valid latest dividend', function (done) {
            stock.getLatestDividend(function(err, res) {
                if (err) throw err;
                assert(res == '0.52');
                done();
            });
        });
    });

    describe('#getEPS()', function () {
        it('should return a valid EPS', function (done) {
            stock.getEPS(function(err, res) {
                if (err) throw err;
                assert(res == '9.41');
                done();
            });
        });
    });

    describe('#getSharesOutstanding()', function () {
        it('should return a valid Shares Outstanding', function (done) {
            stock.getSharesOutstanding(function(err, res) {
                if (err) throw err;
                if (res == '2.29B');
                done();
            });
        });
    });

    describe('#getBeta()', function () {
        it('should return a valid Beta', function (done) {
            stock.getBeta(function(err, res) {
                if (err) throw err;
                assert(res == '0.97');
                done();
            });
        });
    });

    describe('#getInstitutionalOwnership()', function () {
        it('should return a valid Inst. Ownership', function (done) {
            stock.getInstitutionalOwnership(function(err, res) {
                if (err) throw err;
                if (res == '69%');
                done();
            });
        });
    });
});

