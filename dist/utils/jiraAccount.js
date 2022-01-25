"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAccount = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _watchRespose = _interopRequireWildcard(require("./watchRespose"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var questionUrl = 'http://jira.taimei.com/rest/issueNav/1/issueTable';

var initAccount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(account) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve, reject) {
                var browser, questionData, page, loginInput, loginPassword, loginSubmitBtn, response;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _puppeteer["default"].launch({
                          headless: false,
                          defaultViewport: {
                            width: 1280,
                            height: 800
                          }
                        });

                      case 2:
                        browser = _context3.sent;
                        _context3.prev = 3;
                        questionData = {}; // 新建界面

                        _context3.next = 7;
                        return browser.newPage();

                      case 7:
                        page = _context3.sent;
                        _context3.next = 10;
                        return page.setRequestInterception(true);

                      case 10:
                        page.on('request', /*#__PURE__*/function () {
                          var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req) {
                            return _regenerator["default"].wrap(function _callee$(_context) {
                              while (1) {
                                switch (_context.prev = _context.next) {
                                  case 0:
                                    req["continue"]({});

                                  case 1:
                                  case "end":
                                    return _context.stop();
                                }
                              }
                            }, _callee);
                          }));

                          return function (_x4) {
                            return _ref3.apply(this, arguments);
                          };
                        }());
                        page.on('response', /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(res) {
                            var key;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    _context2.t0 = _regenerator["default"].keys(_watchRespose["default"]);

                                  case 1:
                                    if ((_context2.t1 = _context2.t0()).done) {
                                      _context2.next = 9;
                                      break;
                                    }

                                    key = _context2.t1.value;

                                    if (!(res.url().indexOf(key) !== -1)) {
                                      _context2.next = 7;
                                      break;
                                    }

                                    _context2.next = 6;
                                    return _watchRespose["default"][key](res, page, account, browser, resolve, reject);

                                  case 6:
                                    return _context2.abrupt("return", _context2.sent);

                                  case 7:
                                    _context2.next = 1;
                                    break;

                                  case 9:
                                    if (!(res.url().indexOf(questionUrl) !== -1)) {
                                      _context2.next = 16;
                                      break;
                                    }

                                    _context2.next = 12;
                                    return res.json();

                                  case 12:
                                    questionData = _context2.sent;
                                    _context2.next = 15;
                                    return browser.close();

                                  case 15:
                                    resolve(questionData);

                                  case 16:
                                    return _context2.abrupt("return", res);

                                  case 17:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x5) {
                            return _ref4.apply(this, arguments);
                          };
                        }()); // 跳转界面

                        _context3.next = 14;
                        return page["goto"]('http://jira.taimei.com/login.jsp');

                      case 14:
                        _context3.next = 16;
                        return page.$('#login-form-username');

                      case 16:
                        loginInput = _context3.sent;
                        _context3.next = 19;
                        return page.$('#login-form-password');

                      case 19:
                        loginPassword = _context3.sent;
                        _context3.next = 22;
                        return page.$('#login-form-submit');

                      case 22:
                        loginSubmitBtn = _context3.sent;
                        // 获取焦点  填充内容
                        loginInput.focus();
                        _context3.next = 26;
                        return page.keyboard.type(account.name);

                      case 26:
                        loginPassword.focus();
                        _context3.next = 29;
                        return page.keyboard.type(account.password);

                      case 29:
                        _context3.next = 31;
                        return loginSubmitBtn.click();

                      case 31:
                        _context3.next = 33;
                        return page.waitForNavigation({
                          waitUntil: 'networkidle0'
                        });

                      case 33:
                        response = _context3.sent;
                        _context3.next = 36;
                        return (0, _watchRespose.loginFn)(response, browser, reject);

                      case 36:
                        _context3.next = 43;
                        break;

                      case 38:
                        _context3.prev = 38;
                        _context3.t0 = _context3["catch"](3);
                        _context3.next = 42;
                        return browser.close();

                      case 42:
                        reject(_context3.t0);

                      case 43:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[3, 38]]);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function initAccount(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.initAccount = initAccount;