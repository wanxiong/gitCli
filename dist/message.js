"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _chalk = _interopRequireDefault(require("chalk"));

var _index = require("./utils/index");

var _constants = require("./utils/constants");

var _push = require("./push");

var ora = require('ora');

var message = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(action, d) {
    var designatedBoard, allData, fileData, data, sformData, ownList, pre, moduleType, formAnswer, commitMessage, completeText;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            designatedBoard = d.designatedBoard, allData = d.allData;
            _context.next = 3;
            return (0, _index.getGitFile)();

          case 3:
            fileData = _context.sent;
            data = {}; // 存在过期时间

            _context.next = 7;
            return (0, _index.getJiraData)(fileData, designatedBoard);

          case 7:
            data = _context.sent;
            // 执行交互命令选择获取的内容
            sformData = (0, _push.getSformData)(data, fileData.name, allData, designatedBoard);
            ownList = sformData.perfect;

            if (ownList.length) {
              _context.next = 12;
              break;
            }

            throw new Error(_chalk["default"].red('看板类型 ' + fileData.boardType + ' 数据为空,请确认账户 ' + fileData.name + ' 是否没有数据'));

          case 12:
            _context.next = 14;
            return _inquirer["default"].prompt([{
              type: 'rawlist',
              name: 'preType',
              message: '请选择更改类型（回车确认）',
              choices: _constants.typeList,
              pageSize: 10
            }]);

          case 14:
            pre = _context.sent;
            _context.next = 17;
            return _inquirer["default"].prompt([{
              type: 'checkbox',
              name: 'moduleType',
              message: '请选择模块范围（空格选中、可回车跳过）',
              choices: _constants.scopes,
              pageSize: 20
            }]);

          case 17:
            moduleType = _context.sent;
            _context.next = 20;
            return _inquirer["default"].prompt([{
              type: 'checkbox',
              name: 'sformType',
              message: '请选择提交对应的SFORM',
              choices: ownList,
              pageSize: 30,
              validate: function validate(text) {
                var done = this.async();

                if (!text.length) {
                  done(null, false);
                } else {
                  done(null, true);
                }
              }
            }]);

          case 20:
            formAnswer = _context.sent;
            _context.next = 23;
            return _inquirer["default"].prompt([{
              type: 'input',
              name: 'commitText',
              message: '请输入提交的备注信息'
            }]);

          case 23:
            commitMessage = _context.sent;
            // release(mdm-antd, mdm-creator): sform-4118 xxxxx
            completeText = "".concat(pre.preType).concat(moduleType.moduleType.lenght ? "(".concat(moduleType.moduleType, ")") : '', ": ").concat(formAnswer.sformType, " ").concat(commitMessage.commitText);
            console.log(_chalk["default"].yellowBright('\n请拷贝(最终提交文案)：'), _chalk["default"].greenBright(completeText + '\n'));

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function message(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = message;