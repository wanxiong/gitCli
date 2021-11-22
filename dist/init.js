"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _chalk = _interopRequireDefault(require("chalk"));

var _index = require("./utils/index");

// 创建git账号文件
var createFile = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(name, password) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _index.createGitFile)({
              name: name,
              password: password
            });

          case 2:
            console.log(_chalk["default"].green('jira配置文件写入成功'));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createFile(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var init = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(action) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _inquirer["default"].prompt([{
              type: 'confirm',
              name: 'isInit',
              message: '是否初始化jira账号'
            }]).then( /*#__PURE__*/function () {
              var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(answer) {
                var isInit;
                return _regenerator["default"].wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        isInit = answer.isInit;
                        isInit && _inquirer["default"].prompt([{
                          name: 'name',
                          message: '请输入jira账号'
                        }, {
                          type: 'password',
                          name: 'password',
                          message: '请输入jira密码'
                        }]).then( /*#__PURE__*/function () {
                          var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(answer) {
                            var name, password, nameTrim, passwordTrim;
                            return _regenerator["default"].wrap(function _callee2$(_context2) {
                              while (1) {
                                switch (_context2.prev = _context2.next) {
                                  case 0:
                                    name = answer.name, password = answer.password;
                                    nameTrim = name.trim() || '';
                                    passwordTrim = password.trim() || '';
                                    createFile(nameTrim, passwordTrim);

                                  case 4:
                                  case "end":
                                    return _context2.stop();
                                }
                              }
                            }, _callee2);
                          }));

                          return function (_x5) {
                            return _ref4.apply(this, arguments);
                          };
                        }());

                      case 2:
                      case "end":
                        return _context3.stop();
                    }
                  }
                }, _callee3);
              }));

              return function (_x4) {
                return _ref3.apply(this, arguments);
              };
            }());

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function init(_x3) {
    return _ref2.apply(this, arguments);
  };
}();

module.exports = init;