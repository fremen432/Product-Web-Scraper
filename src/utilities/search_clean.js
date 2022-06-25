"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.Search = void 0;
var puppeteer_1 = require("puppeteer");
var constants_1 = require("./constants");
var amazonSelector1 = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div.s-result-item.s-widget.s-widget-spacing-large.AdHolder.s-flex-full-width';
// div containing each individual product returned from our search
var amazonSelector2 = '#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6)';
// span containing the products price
var amazonSelector3 = "#search > div.s-desktop-width-max.s-desktop-content.s-opposite-dir.sg-row > div.s-matching-dir.sg-col-16-of-20.sg-col.sg-col-8-of-12.sg-col-12-of-16 > div > span:nth-child(4) > div.s-main-slot.s-result-list.s-search-results.sg-row > div:nth-child(6) > div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
// list item shortened
var amazonSelector4 = 'div.s-result-item';
// span containing the products price
var amazonSelector5 = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
// span containing the products price
var amazonSelector6 = "div > div > div > div > div > div > div > div > div > div > div > div > div > a > span > span.a-offscreen";
var Search = /** @class */ (function () {
    // selector: String;
    function Search(inputs) {
        var makeFullURL = function (input) {
            switch (input.webSite) {
                case constants_1.AMAZON:
                    return "https://www.amazon.com/s?k=".concat(input.productName, "&rh=p_36%3A").concat(input.min_price, "00-").concat(input.max_price, "00");
                case constants_1.EBAY:
                    return "https://www.ebay.com/sch/i.html?&_nkw=".concat(input.productName, "&_udlo=").concat(input.min_price, "&_udhi=").concat(input.max_price);
                case constants_1.WALMART:
                    return "https://www.walmart.com/search?q=".concat(input.productName, "&min_price=").concat(input.min_price, "&max_price=").concat(input.max_price);
                case constants_1.CRAIGSLIST:
                    return "https://austin.craigslist.org/search/sss?query=".concat(input.productName, "&min_price=").concat(input.min_price, "&max_price=").concat(input.max_price);
                case constants_1.TARGET:
                    return "https://www.target.com/s?searchTerm=".concat(input.productName, "&minPrice=").concat(input.min_price, "&maxPrice=").concat(input.max_price);
                default:
                    '';
            }
            return '';
        };
        // this.selector = this.in
        this.fullURL = makeFullURL(inputs);
        this.webSite = inputs.webSite;
        this.productName = inputs.productName;
        this.min_price = inputs.min_price;
        this.max_price = inputs.max_price;
    }
    Search.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer_1["default"].launch()];
                    case 1:
                        _a.browser = _c.sent();
                        _b = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 2:
                        _b.page = _c.sent();
                        return [4 /*yield*/, this.page.goto(this.fullURL)];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Search.prototype.disConnect = function () {
        this.browser.close();
    };
    Search.prototype.printThis = function () {
        console.log(this);
    };
    Search.prototype.printURL = function () {
        console.log(this.fullURL);
    };
    Search.prototype.printProduct = function () {
        console.log(this.productName);
    };
    Search.prototype.printMine = function () {
        var element_1 = this.firstParagraph;
        var element_2 = this.srcTxt;
        console.log({ element_1: element_1, element_2: element_2 });
    };
    Search.prototype.OPPERATION_getCoordinates = function (thisSelector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$eval(thisSelector, function (el) {
                            var domRect = el.getBoundingClientRect();
                            var x = Number(domRect.left.toFixed());
                            var y = Number(domRect.top.toFixed());
                            var height = Number(domRect.height.toFixed());
                            var width = Number(domRect.width.toFixed());
                            return { x: x, y: y, height: height, width: width };
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Search.prototype.OPPERATION_getScreenShot_clip = function (coordinates) {
        return __awaiter(this, void 0, void 0, function () {
            var x, y, width, height;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        x = coordinates.x;
                        y = coordinates.y;
                        width = coordinates.width;
                        height = coordinates.height;
                        return [4 /*yield*/, this.page.screenshot({
                                path: "../images/screenshots/clips/screenshot".concat(Date.now(), ".png"),
                                clip: { x: x, y: y, width: width, height: height }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Search.prototype.OPPERATION_getScreenShot_fullpage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.screenshot({
                            // path: `../images/screenshots/fullpage/screenshot${Date.now()}.png`,
                            path: "../assets/screenshots/fullpage/screenshot".concat(Date.now(), ".png"),
                            fullPage: true
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Search.prototype.OPERATION_getTextContent_one = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$eval(selector, function (el) { return el.textContent; })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Search.prototype.OPERATION_getTextContent_all = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var array;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        array = [];
                        // first select all $$eval(item selector) to get every product on the page, then for each item, select the price $eval(price selector)
                        return [4 /*yield*/, this.page.$eval(selector, function (el) {
                                var amazonSelector = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
                                var price = el.$eval(amazonSelector, function (el) { return el.textContent; });
                                array.push(price);
                            })];
                    case 1:
                        // first select all $$eval(item selector) to get every product on the page, then for each item, select the price $eval(price selector)
                        _a.sent();
                        return [2 /*return*/, array];
                }
            });
        });
    };
    Search.prototype.OPERATION_getTextContent_all2 = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var amazonSelector, amazonSelector4, result, newResults;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        amazonSelector = "div > div > div > div > div > div.sg-col.sg-col-4-of-12.sg-col-8-of-16.sg-col-12-of-20.s-list-col-right > div > div > div.sg-row > div.sg-col.sg-col-4-of-12.sg-col-4-of-16.sg-col-4-of-20 > div > div.a-section.a-spacing-none.a-spacing-top-small.s-price-instructions-style > div > a > span > span.a-offscreen";
                        amazonSelector4 = 'div.s-result-item';
                        return [4 /*yield*/, this.page.$$(amazonSelector4)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, result.map(function (el) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4 /*yield*/, el.$eval('div', (function (subEl) { return subEl.textContent; }))];
                                            case 1: return [2 /*return*/, _a.sent()];
                                        }
                                    });
                                });
                            })
                            // const newResult = await result.$('div')
                            // .$('div > a > span > span.a-offscreen')
                        ];
                    case 2:
                        newResults = _a.sent();
                        // const newResult = await result.$('div')
                        // .$('div > a > span > span.a-offscreen')
                        return [2 /*return*/, newResults
                            // return newResult
                            // fs.writeFileSync('../assets/data.json', JSON.stringify(result));
                            // .$(amazonSelector)
                            //.$(amazonSelector).textContent
                            // return result
                            // .map(x => {
                            // 	x.$eval(amazonSelector, el => el.textContent)
                            // })
                            // return array
                        ];
                }
            });
        });
    };
    Search.prototype.OPERATION_getFiveProducts = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.page.$$eval(selector)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Search.prototype.getScreenShot_clip = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connect()
                    .then(function () { return console.log("-- CONNECTED --"); })
                    .then(function () { return _this.OPPERATION_getCoordinates(selector); })
                    .then(function (result) { return _this.OPPERATION_getScreenShot_clip(result); })
                    .then(function () { return _this.disConnect(); })
                    .then(function () { return console.log("-- DONE --"); });
                return [2 /*return*/];
            });
        });
    };
    Search.prototype.getScreenShot_fullpage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connect()
                    .then(function () { return console.log("-- CONNECTED --"); })
                    .then(function () { return _this.OPPERATION_getScreenShot_fullpage(); })
                    .then(function () { return _this.disConnect(); })
                    .then(function () { return console.log("-- DONE --"); });
                return [2 /*return*/];
            });
        });
    };
    Search.prototype.getTextContent_one = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connect()
                    .then(function () { return console.log("-- CONNECTED --"); })
                    .then(function () { return _this.OPERATION_getTextContent_one(selector); })
                    .then(function (result) { return console.log(result); })
                    .then(function () { return _this.disConnect(); })
                    .then(function () { return console.log("-- DONE --"); });
                return [2 /*return*/];
            });
        });
    };
    Search.prototype.getTextContent_all = function (selector) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connect()
                    .then(function () { return console.log("-- CONNECTED --"); })
                    // .then(() => this.OPERATION_getTextContent_all(selector))
                    .then(function () { return _this.OPERATION_getTextContent_all2(selector); })
                    .then(function (result) { return console.log(result); })
                    .then(function () { return _this.disConnect(); })
                    .then(function () { return console.log("-- DONE --"); });
                return [2 /*return*/];
            });
        });
    };
    Search.prototype.opperation_2 = function (input) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.connect()
                    .then(function () { return console.log("-- CONNECTED --"); })
                    .then(function () { return console.log(input); })
                    .then(function () { return _this.disConnect(); })
                    .then(function () { return console.log("-- DONE --"); });
                return [2 /*return*/];
            });
        });
    };
    return Search;
}());
exports.Search = Search;
var searchInputs1 = {
    webSite: constants_1.AMAZON,
    productName: 'iPhone',
    min_price: 100,
    max_price: 400,
    condition: 'New'
};
var search1 = new Search(searchInputs1);
search1.getTextContent_all(amazonSelector4);
