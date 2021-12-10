"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAccount = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

var getListUrl = 'http://jira.taimei.com/rest/greenhopper/1.0/xboard/work/allData.json';
var questionUrl = 'http://jira.taimei.com/rest/issueNav/1/issueTable';

function toQuestionPage(_x) {
  return _toQuestionPage.apply(this, arguments);
}

function _toQuestionPage() {
  _toQuestionPage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(page) {
    var questionBtn, linkToBtn;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return page.$('#find_link');

          case 2:
            questionBtn = _context5.sent;
            _context5.next = 5;
            return questionBtn.click();

          case 5:
            _context5.next = 7;
            return page.waitForTimeout(1000);

          case 7:
            _context5.next = 9;
            return page.$('#filter_lnk_my_lnk');

          case 9:
            linkToBtn = _context5.sent;
            linkToBtn.click();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _toQuestionPage.apply(this, arguments);
}

var initAccount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(account) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(resolve, reject) {
                var browser, questionData, page, loginInput, loginPassword, loginSubmitBtn, boardBtn, boardList, linkList, i, data, hasBoard, reg, mat, str, params, respone, jsonData;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _puppeteer["default"].launch({
                          headless: true,
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

                          return function (_x5) {
                            return _ref3.apply(this, arguments);
                          };
                        }());
                        page.on('response', /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(res) {
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    if (!(res.url().indexOf(questionUrl) !== -1)) {
                                      _context2.next = 7;
                                      break;
                                    }

                                    _context2.next = 3;
                                    return res.json();

                                  case 3:
                                    questionData = _context2.sent;
                                    _context2.next = 6;
                                    return browser.close();

                                  case 6:
                                    resolve(questionData);

                                  case 7:
                                    return _context2.abrupt("return", res);

                                  case 8:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x6) {
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
                        return page.waitForTimeout(account.delay);

                      case 33:
                        _context3.next = 35;
                        return page.$('#greenhopper_menu');

                      case 35:
                        boardBtn = _context3.sent;
                        _context3.next = 38;
                        return page.screenshot({
                          path: _path["default"].resolve(__dirname, '../account.png')
                        });

                      case 38:
                        if (!(account.designatedBoard.trim().toLocaleLowerCase() === _constants.BoardBug)) {
                          _context3.next = 42;
                          break;
                        }

                        _context3.next = 41;
                        return toQuestionPage(page);

                      case 41:
                        return _context3.abrupt("return");

                      case 42:
                        _context3.next = 44;
                        return boardBtn.click();

                      case 44:
                        // 获取面板下拉数据   ----- 面板
                        boardList = []; // 等待2秒 跳转需要时间

                        _context3.next = 47;
                        return page.waitForTimeout(1000);

                      case 47:
                        _context3.next = 49;
                        return page.$$('#greenhopper_menu_dropdown_recent .aui-list-truncate li');

                      case 49:
                        linkList = _context3.sent;
                        i = 0;

                      case 51:
                        if (!(i < linkList.length)) {
                          _context3.next = 59;
                          break;
                        }

                        _context3.next = 54;
                        return linkList[i].$eval('a', function (el) {
                          var href = el.getAttribute('href'); // 获取所有的信息

                          // 获取所有的信息
                          return {
                            originHref: 'http://jira.taimei.com' + href,
                            innerHTML: el.innerHTML,
                            id: el.getAttribute('id')
                          };
                        });

                      case 54:
                        data = _context3.sent;
                        boardList.push(data);

                      case 56:
                        i++;
                        _context3.next = 51;
                        break;

                      case 59:
                        hasBoard = boardList.filter(function (item) {
                          var text = item.innerHTML;

                          if (text.trim() === account.designatedBoard.trim()) {
                            return item;
                          }
                        });

                        if (!hasBoard.length) {
                          _context3.next = 76;
                          break;
                        }

                        reg = new RegExp("rapidView=([^&?]*)", "ig");
                        mat = reg.exec(hasBoard[0].originHref);
                        str = mat ? mat[1] : '';
                        params = '?rapidViewId=' + str;
                        _context3.next = 67;
                        return page["goto"](getListUrl + params);

                      case 67:
                        respone = _context3.sent;
                        _context3.next = 70;
                        return respone.json();

                      case 70:
                        jsonData = _context3.sent;
                        _context3.next = 73;
                        return browser.close();

                      case 73:
                        resolve(jsonData);
                        _context3.next = 77;
                        break;

                      case 76:
                        throw new Error('你没有相关的看板内容====' + account.designatedBoard.trim() + ',请重新选择看板');

                      case 77:
                        _context3.next = 84;
                        break;

                      case 79:
                        _context3.prev = 79;
                        _context3.t0 = _context3["catch"](3);
                        _context3.next = 83;
                        return browser.close();

                      case 83:
                        reject(_context3.t0);

                      case 84:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3, null, [[3, 79]]);
              }));

              return function (_x3, _x4) {
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

  return function initAccount(_x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.initAccount = initAccount;