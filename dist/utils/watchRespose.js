"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

var _chalk = _interopRequireDefault(require("chalk"));

var _dashboard$loginUrl;

/**
 * 看板接口关键字-对应路径： http://jira.taimei.com/secure/Dashboard.jspa
 */
var dashboard = 'issueTable/filter';
/**
 * 对应数据接口
 */

var getListUrl = 'http://jira.taimei.com/rest/greenhopper/1.0/xboard/work/allData.json';
/**
 * 登录接口
 */

var loginUrl = 'http://jira.taimei.com/login.jsp';
var loginFail = '的用户名和密码不正确';

function toQuestionPage(_x) {
  return _toQuestionPage.apply(this, arguments);
} // 看板


function _toQuestionPage() {
  _toQuestionPage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(page) {
    var questionBtn, linkToBtn;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return page.$('#find_link');

          case 2:
            questionBtn = _context2.sent;
            _context2.next = 5;
            return questionBtn.click();

          case 5:
            _context2.next = 7;
            return page.waitForTimeout(1000);

          case 7:
            _context2.next = 9;
            return page.$('#filter_lnk_my_lnk');

          case 9:
            linkToBtn = _context2.sent;
            linkToBtn.click();

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _toQuestionPage.apply(this, arguments);
}

function dashboardFn(respone, page, account, browser, resolve, reject) {
  Promise.resolve().then( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var boardBtn, boardList, linkList, i, data, hasBoard, reg, mat, str, params, _respone, jsonData;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return page.waitForTimeout(account.delay);

          case 2:
            _context.next = 4;
            return page.$('#greenhopper_menu');

          case 4:
            boardBtn = _context.sent;
            _context.next = 7;
            return page.screenshot({
              path: _path["default"].resolve(__dirname, '../account.png')
            });

          case 7:
            if (!(account.designatedBoard.trim().toLocaleLowerCase() === _constants.BoardBug)) {
              _context.next = 11;
              break;
            }

            _context.next = 10;
            return toQuestionPage(page);

          case 10:
            return _context.abrupt("return");

          case 11:
            _context.next = 13;
            return boardBtn.click();

          case 13:
            // 获取面板下拉数据   ----- 面板
            boardList = []; // 等待2秒 跳转需要时间

            _context.next = 16;
            return page.waitForTimeout(1000);

          case 16:
            _context.next = 18;
            return page.$$('#greenhopper_menu_dropdown_recent .aui-list-truncate li');

          case 18:
            linkList = _context.sent;
            i = 0;

          case 20:
            if (!(i < linkList.length)) {
              _context.next = 28;
              break;
            }

            _context.next = 23;
            return linkList[i].$eval('a', function (el) {
              var href = el.getAttribute('href'); // 获取所有的信息

              // 获取所有的信息
              return {
                originHref: 'http://jira.taimei.com' + href,
                innerHTML: el.innerHTML,
                id: el.getAttribute('id')
              };
            });

          case 23:
            data = _context.sent;
            boardList.push(data);

          case 25:
            i++;
            _context.next = 20;
            break;

          case 28:
            hasBoard = boardList.filter(function (item) {
              var text = item.innerHTML;

              if (text.trim() === account.designatedBoard.trim()) {
                return item;
              }
            });

            if (!hasBoard.length) {
              _context.next = 44;
              break;
            }

            reg = new RegExp("rapidView=([^&?]*)", "ig");
            mat = reg.exec(hasBoard[0].originHref);
            str = mat ? mat[1] : '';
            params = '?rapidViewId=' + str;
            _context.next = 36;
            return page["goto"](getListUrl + params);

          case 36:
            _respone = _context.sent;
            _context.next = 39;
            return _respone.json();

          case 39:
            jsonData = _context.sent;
            browser.close();
            resolve(jsonData);
            _context.next = 45;
            break;

          case 44:
            throw new Error('你没有相关的看板内容====' + account.designatedBoard.trim() + ',请重新选择看板');

          case 45:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })))["catch"](function (error) {
    console.log(error);
    browser.close();
    reject(error);
  });
  return respone;
} // 登录接口


function loginFn(_x2, _x3, _x4, _x5, _x6, _x7) {
  return _loginFn.apply(this, arguments);
}

function _loginFn() {
  _loginFn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(respone, page, account, browser, resolve, reject) {
    var html;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return respone.text();

          case 2:
            html = _context3.sent;

            if (html.indexOf(loginFail) !== '-1') {
              browser.close();
              reject("\n        ".concat(_chalk["default"].bgRed("\u5F88\u62B1\u6B49, \u60A8\u7684\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u6B63\u786E\uFF0C\u8BF7\u786E\u8BA4\u5199\u5165\u7684\u8D26\u6237\u914D\u7F6E\u662F\u5426\u6B63\u786E"), "\n        ").concat(_chalk["default"].yellowBright('你可以执行命令：')).concat(_chalk["default"].cyanBright('mdmGit init'), "\n        \u91CD\u7F6E\u6210\u65B0\u7684\u914D\u7F6E\n        "));
            }

            return _context3.abrupt("return", respone);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _loginFn.apply(this, arguments);
}

var _default = (_dashboard$loginUrl = {}, (0, _defineProperty2["default"])(_dashboard$loginUrl, dashboard, dashboardFn), (0, _defineProperty2["default"])(_dashboard$loginUrl, loginUrl, loginFn), _dashboard$loginUrl);

exports["default"] = _default;