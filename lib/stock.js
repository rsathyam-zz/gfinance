var request = require('request');
var cheerio = require('cheerio');

function Stock(name) {
    this.base_url = 'http://www.google.com/finance?q=' + name;
    this.html = null;
}

Stock.create = function(name, callback) {
    var stock = new Stock(name);
    stock.fetchData(function(err, res) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, stock);
        }
    });
}

Stock.prototype.fetchData = function(callback) {
    var self = this;
    request(this.base_url, function(err, res, html) {
        if (err) {
            callback(err, null);
        } else {
            self.html = html;
            callback(null, html);
        }
    });
}

Stock.prototype.getSnapshotPrice = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var price = null;
            var $ = cheerio.load(res);
            $('.pr').each(function (i, element) {
                element.children.forEach(function(child) {
                    if (child.name == "span") {
                        child.children.forEach(function(child2) {
                            if (!isNaN(parseFloat(child2.data))) {
                                price = child2.data.toString();
                            }
                        });
                    }
                });
            });
            price != null ? callback(null, price) : callback(new Error('Price not found'), null);
        }
    });
}

Stock.prototype.getDayRange = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var range = null;
            var $ = cheerio.load(res);
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function(child) {
                    if (child.name == "tr") {
                        child.children.forEach(function(child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Range") >= 0) {
                                var range_data = child2.next.next.children[0].data.split('-');
                                var min_price = parseFloat(range_data[0]);
                                var max_price = parseFloat(range_data[1]);
                                range = [min_price, max_price];
                            }
                        });
                    }
                });
            });
            range != null ? callback(null, range) : callback(new Error('Day range not found'), null);
        }
    });
}

Stock.prototype.getYearRange = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var range = null;
            var $ = cheerio.load(res);
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function(child) {
                    if (child.name == "tr") {
                        child.children.forEach(function(child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("52 week") >= 0) {
                                var range_data = child2.next.next.children[0].data.split('-');
                                var min_price = parseFloat(range_data[0]);
                                var max_price = parseFloat(range_data[1]);
                                range = [min_price, max_price];
                            }
                        });
                    }
                });
            });
            range != null ? callback(null, range) : callback(new Error('Year range not found'), null);
        }
    });
}

Stock.prototype.getOpenPrice = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var open_price = null;
            var $ = cheerio.load(res);
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function(child) {
                    if (child.name == "tr") {
                        child.children.forEach(function(child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Open") >= 0) {
                                open_price = parseFloat(child2.next.next.children[0].data);
                            }
                        });
                    }
                });
            });
            open_price != null ? callback(null, open_price) : callback(new Error('Open price not found'), null);
        }
    });
}

Stock.prototype.getMarketCap = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var mkt_cap = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function(child) {
                    if (child.name == "tr") {
                        child.children.forEach(function(child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Mkt cap") >= 0) {
                                mkt_cap = child2.next.next.children[0].data.replace(/^\s+|\s+$/g, '').toString();
                            }
                        });
                    }
                });
            });
            mkt_cap != null ? callback(null, mkt_cap) : callback(new Error('Market cap not found'), null);
        }
    });
}

Stock.prototype.getPE = function(callback) {
     this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var pe = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("P/E") >= 0) {
                                pe = parseFloat(child2.next.next.children[0].data);
                            }
                        });
                    }
                });
            });
            pe != null ? callback(null, pe) : callback(new Error('P/E not found'), null);
        }
    });
}

Stock.prototype.getVolume = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var volume = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Vol / Avg.") >= 0) {
                                volume = child2.next.next.children[0].data.split('/')[0];
                            }
                        });
                    }
                });
            });
            volume != null ? callback(null, volume) : callback(new Error('Volume not found'), null);
        }
    });
}

Stock.prototype.getAverageVolume = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var volume = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Vol / Avg.") >= 0) {
                                var vol_data = child2.next.next.children[0].data.split('/');
                                volume = vol_data[1].replace(/^\s+|\s+$/g, '').toString();
                            }
                        });
                    }
                });
            });
            volume != null ? callback(null, volume) : callback(new Error('Volume not found'), null);
        }
    });
}

Stock.prototype.getLatestDividend = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var dividend = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf(
                                "Div/yield") >= 0) {
                                var div_data = child2.next.next.children[0].data;
                                if (div_data.replace(/^\s+|\s+$/g, '') == '-') {
                                    callback(new Error('This stock has not issued any dividends yet'), null);
                                } else {
                                    dividend = parseFloat(div_data.split('/')[0]);
                                }
                            }
                        });
                    }
                });
            });
            dividend != null ? callback(null, dividend) : callback(new Error('Dividend data not found'), null);
        }
    });
}

Stock.prototype.getDividendYield = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var yield = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf(
                                    "Div/yield") >= 0) {
                                var div_data = child2.next.next.children[0].data;
                                if (div_data.replace(/^\s+|\s+$/g, '') == '-') {
                                    callback(new Error('This stock has not issued any dividends yet'), null);
                                } else {
                                    yield = parseFloat(div_data.split('/')[1]);
                                }
                            }
                        });
                    }
                });
            });
            yield != null ? callback(null, yield) : callback(new Error('Dividend data not found'), null);
        }
    });
}

Stock.prototype.getEPS = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var eps = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("EPS") >= 0) {
                                eps = parseFloat(child2.next.next.children[0].data);
                            }
                        });
                    }
                });
            });
            eps != null ? callback(null, eps) : callback(new Error('EPS not found'), null);
        }
    });
}

Stock.prototype.getSharesOutstanding = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var shares = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Shares") >= 0) {
                                shares = child2.next.next.children[0].data.replace(/^\s+|\s+$/g, '').toString();
                            }
                        });
                    }
                });
            });
            shares != null ? callback(null, shares) : callback(new Error('Shares outstanding not found'), null);
        }
    });
}

Stock.prototype.getBeta = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var beta = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Beta") >= 0) {
                                beta = parseFloat(child2.next.next.children[0].data);
                            }
                        });
                    }
                });
            });
            beta != null ? callback(null, beta) : callback(new Error('Beta not found'), null);
        }
    });
}

Stock.prototype.getInstitutionalOwnership = function(callback) {
    this.fetchData(function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            var $ = cheerio.load(res);
            var inst_ownership = null;
            $('.snap-data').each(function (i, element) {
                element.children.forEach(function (child) {
                    if (child.name == "tr") {
                        child.children.forEach(function (child2) {
                            if (child2.name == "td" && child2.children[0].data.indexOf("Inst. own") >= 0) {
                                inst_ownership = child2.next.next.children[0].data.replace(/^\s+|\s+$/g, '').toString();
                            }
                        });
                    }
                });
            });
            inst_ownership != null ? callback(null, inst_ownership) :
                callback(new Error('Inst. ownership not found'), null);
        }
    });
}

module.exports = Stock;
