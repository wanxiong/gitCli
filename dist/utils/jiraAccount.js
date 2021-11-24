"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAccount = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _puppeteer = _interopRequireDefault(require("puppeteer"));

// const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer');
var getListUrl = 'http://jira.taimei.com/rest/greenhopper/1.0/xboard/work/allData.json';

var initAccount = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(account) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(resolve, reject) {
                var browser, page, loginInput, loginPassword, loginSubmitBtn, boardBtn, boardList, linkList, i, data, hasBoard, reg, mat, str, params, respone, jsonData;
                return _regenerator["default"].wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _puppeteer["default"].launch({
                          headless: true,
                          defaultViewport: {
                            width: 1280,
                            height: 800
                          }
                        });

                      case 2:
                        browser = _context.sent;
                        _context.prev = 3;
                        _context.next = 6;
                        return browser.newPage();

                      case 6:
                        page = _context.sent;
                        _context.next = 9;
                        return page["goto"]('http://jira.taimei.com/login.jsp');

                      case 9:
                        _context.next = 11;
                        return page.$('#login-form-username');

                      case 11:
                        loginInput = _context.sent;
                        _context.next = 14;
                        return page.$('#login-form-password');

                      case 14:
                        loginPassword = _context.sent;
                        _context.next = 17;
                        return page.$('#login-form-submit');

                      case 17:
                        loginSubmitBtn = _context.sent;
                        // 获取焦点  填充内容
                        loginInput.focus();
                        _context.next = 21;
                        return page.keyboard.type(account.name);

                      case 21:
                        loginPassword.focus();
                        _context.next = 24;
                        return page.keyboard.type(account.password);

                      case 24:
                        _context.next = 26;
                        return loginSubmitBtn.click();

                      case 26:
                        _context.next = 28;
                        return page.waitForTimeout(account.delay);

                      case 28:
                        _context.next = 30;
                        return page.$('#greenhopper_menu');

                      case 30:
                        boardBtn = _context.sent;
                        _context.next = 33;
                        return page.screenshot({
                          path: process.cwd() + '/account.png'
                        });

                      case 33:
                        _context.next = 35;
                        return boardBtn.click();

                      case 35:
                        // 获取下拉数据
                        boardList = [];
                        _context.next = 38;
                        return page.$$('#greenhopper_menu_dropdown_recent .aui-list-truncate li');

                      case 38:
                        linkList = _context.sent;
                        i = 0;

                      case 40:
                        if (!(i < linkList.length)) {
                          _context.next = 48;
                          break;
                        }

                        _context.next = 43;
                        return linkList[i].$eval('a', function (el) {
                          var href = el.getAttribute('href'); // 获取所有的信息

                          // 获取所有的信息
                          return {
                            originHref: 'http://jira.taimei.com' + href,
                            innerHTML: el.innerHTML,
                            id: el.getAttribute('id')
                          };
                        });

                      case 43:
                        data = _context.sent;
                        boardList.push(data);

                      case 45:
                        i++;
                        _context.next = 40;
                        break;

                      case 48:
                        _context.next = 50;
                        return page.screenshot({
                          path: __dirname + '../account.png'
                        });

                      case 50:
                        hasBoard = boardList.filter(function (item) {
                          var text = item.innerHTML;

                          if (text.trim() === account.designatedBoard.trim()) {
                            return item;
                          }
                        });

                        if (!hasBoard.length) {
                          _context.next = 67;
                          break;
                        }

                        reg = new RegExp("rapidView=([^&?]*)", "ig");
                        mat = reg.exec(hasBoard[0].originHref);
                        str = mat ? mat[1] : '';
                        params = '?rapidViewId=' + str;
                        _context.next = 58;
                        return page["goto"](getListUrl + params);

                      case 58:
                        respone = _context.sent;
                        _context.next = 61;
                        return respone.json();

                      case 61:
                        jsonData = _context.sent;
                        _context.next = 64;
                        return browser.close();

                      case 64:
                        resolve(jsonData);
                        _context.next = 68;
                        break;

                      case 67:
                        throw new Error('你没有相关的看板内容====' + account.designatedBoard.trim() + ',请重新选择看板');

                      case 68:
                        _context.next = 75;
                        break;

                      case 70:
                        _context.prev = 70;
                        _context.t0 = _context["catch"](3);
                        _context.next = 74;
                        return browser.close();

                      case 74:
                        reject(_context.t0);

                      case 75:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[3, 70]]);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function initAccount(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.initAccount = initAccount;