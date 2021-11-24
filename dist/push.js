"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSformData = exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _chalk = _interopRequireDefault(require("chalk"));

var _index = require("./utils/index");

var _constants = require("./utils/constants");

var ora = require('ora');

var getSformData = function getSformData(data, name, isAll, otherBoard) {
  var parentObj = {};
  var list = [];
  var myselfparentObj = {};
  var otherList = [];
  var perfect = [];

  if (data.issuesData && data.issuesData.issues) {
    var arr = data.issuesData.issues.slice(0, 50);

    for (var i = 0; i < arr.length; i++) {
      if (!arr[i].parentId) {
        // 顶级
        parentObj[arr[i].id] = arr[i];

        if (name === arr[i].assignee) {
          myselfparentObj[arr[i].id] = arr[i];
        }
      } else {
        if (name === arr[i].assignee) {
          otherList.push(arr[i]);
        }

        list.push(arr[i]);
      }
    }

    if (isAll) {
      otherList = list;
      myselfparentObj = parentObj;
    } // 子任务存在别人的父任务当中


    otherList.forEach(function (item) {
      var parentId = item.parentId; // 父任务不是自己创建的

      if (parentObj[parentId] && parentObj[parentId].assignee !== name) {
        myselfparentObj[parentObj[parentId].id] = parentObj[parentId];
      }
    });
    Object.values(myselfparentObj).forEach(function (item) {
      var str = "".concat(item.key, "-").concat(item.assigneeName, "\uFF08\u7236\u4EFB\u52A1\uFF09").concat(item.summary.slice(0, 40));
      perfect.push({
        value: item.key,
        name: str
      });
      otherList.forEach(function (subItem) {
        if (subItem.parentId === item.id) {
          perfect.push({
            value: subItem.key,
            name: "--- ".concat(subItem.key, "-").concat(subItem.assigneeName, "\uFF08\u5B50\u4EFB\u52A1\uFF09").concat(subItem.summary.slice(0, 40))
          });
        }
      });
    });
  } else {
    throw new Error(_chalk["default"].bgRed('当前看板' + otherBoard + '的数据不存在'));
  }

  return {
    parentObj: parentObj,
    childrenAllList: list,
    myselfparentObj: myselfparentObj,
    otherList: otherList,
    perfect: perfect
  };
};

exports.getSformData = getSformData;

var push = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(action, d) {
    var designatedBoard, allData, fileData, data, branchName, sformData, ownList, pre, moduleType, formAnswer, commitMessage, completeText, gitAddStr, gitAuto, gitAddType, ignoreCommitType, customCommit, gitPushStr, gitPushType, _customCommit;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            designatedBoard = d.designatedBoard, allData = d.allData;
            _context.next = 3;
            return (0, _index.getGitFile)();

          case 3:
            fileData = _context.sent;
            data = {};
            branchName = (0, _index.getHeadBranch)(); // 存在过期时间

            _context.next = 8;
            return (0, _index.getJiraData)(fileData, designatedBoard);

          case 8:
            data = _context.sent;
            // 执行交互命令选择获取的内容
            sformData = getSformData(data, fileData.name, allData, designatedBoard);
            ownList = sformData.perfect;

            if (!ownList.length) {
              console.log(_chalk["default"].redBright('看板类型 ' + fileData.boardType + ' 数据为空,请确认账户 ' + fileData.name + ' 是否没有数据'));
            }

            ownList.unshift({
              value: 'skip',
              name: "\u8DF3\u8FC7"
            }); // 本次提交属于新增还是啥

            _context.next = 15;
            return _inquirer["default"].prompt([{
              type: 'rawlist',
              name: 'preType',
              message: '请选择更改类型（回车确认）',
              choices: _constants.typeList,
              pageSize: 10
            }]);

          case 15:
            pre = _context.sent;
            _context.next = 18;
            return _inquirer["default"].prompt([{
              type: 'checkbox',
              name: 'moduleType',
              message: '请选择模块范围（空格选中、可回车跳过）',
              choices: _constants.scopes,
              pageSize: 20
            }]);

          case 18:
            moduleType = _context.sent;
            _context.next = 21;
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

          case 21:
            formAnswer = _context.sent;
            _context.next = 24;
            return _inquirer["default"].prompt([{
              type: 'input',
              name: 'commitText',
              message: '请输入提交的备注信息'
            }]);

          case 24:
            commitMessage = _context.sent;
            // release(mdm-antd, mdm-creator): sform-4118 xxxxx
            completeText = "".concat(pre.preType).concat(moduleType.moduleType.lenght ? "(".concat(moduleType.moduleType, ")") : '', ": ").concat(formAnswer.sformType === 'skip' ? '' : formAnswer.sformType, " ").concat(commitMessage.commitText); // console.log(chalk.green('\n最终提交文案：' + completeText + '\n'))

            gitAddStr = '自定义';
            gitAuto = '一键自动添加、提交、推送'; // 添加暂缓命令

            _context.next = 30;
            return _inquirer["default"].prompt([{
              type: 'rawlist',
              name: 'addType',
              message: '请选择添加命令（如何将文件添加到暂存区）',
              choices: ['git add *', 'git add ./src', gitAddStr, gitAuto].filter(function (text) {
                if (action === 'commit' && text === gitAuto) return false;
                return true;
              })
            }]);

          case 30:
            gitAddType = _context.sent;
            _context.next = 33;
            return _inquirer["default"].prompt([{
              type: 'rawlist',
              name: 'ignoreCommit',
              message: '提交是否跳过commit相关的husky校验',
              choices: ['是', '否'],
              "default": '是'
            }]);

          case 33:
            ignoreCommitType = _context.sent;

            if (!(gitAddType.addType === gitAddStr)) {
              _context.next = 42;
              break;
            }

            _context.next = 37;
            return _inquirer["default"].prompt([{
              type: 'input',
              name: 'cusCommit',
              message: '请输入git命令将文件添加到暂存区',
              "default": 'git add *'
            }]);

          case 37:
            customCommit = _context.sent;
            // 默认添加 执行添加
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright(customCommit.cusCommit));
            (0, _index.execSync)(customCommit.cusCommit);
            _context.next = 54;
            break;

          case 42:
            if (!(gitAddType.addType === gitAuto)) {
              _context.next = 52;
              break;
            }

            // 一键自动化
            // 默认添加 执行添加
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright('git add *'));
            (0, _index.execSync)('git add *');
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright("git commit -m \"".concat(completeText, "\" ").concat(ignoreCommitType.ignoreCommit === '是' ? '--no-verify' : '')));
            (0, _index.execSync)("git commit -m \"".concat(completeText, "\" ").concat(ignoreCommitType.ignoreCommit === '是' ? '--no-verify' : ''));
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright('git push origin ' + "".concat(branchName)));
            (0, _index.execSync)('git push origin ' + "".concat(branchName));
            return _context.abrupt("return");

          case 52:
            // 默认添加 执行添加
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright(gitAddType.addType));
            (0, _index.execSync)(gitAddType.addType);

          case 54:
            // 获取commit文案
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright("git commit -m \"".concat(completeText, "\" ").concat(ignoreCommitType.ignoreCommit === '是' ? '--no-verify' : '')));
            (0, _index.execSync)("git commit -m \"".concat(completeText, "\" ").concat(ignoreCommitType.ignoreCommit === '是' ? '--no-verify' : ''));

            if (!(action === 'commit')) {
              _context.next = 58;
              break;
            }

            return _context.abrupt("return");

          case 58:
            gitPushStr = '自定义';
            _context.next = 61;
            return _inquirer["default"].prompt([{
              type: 'rawlist',
              name: 'pushType',
              message: '请选择提交命令（提交到远程哪个分支）',
              choices: ["git push origin " + "".concat(branchName), '自定义']
            }]);

          case 61:
            gitPushType = _context.sent;

            if (!(gitPushType.pushType !== gitPushStr)) {
              _context.next = 68;
              break;
            }

            // 默认添加 执行添加
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright(gitPushType.pushType));
            (0, _index.execSync)('git push origin feature/3.2.19_SFORM_3678');
            return _context.abrupt("return");

          case 68:
            _context.next = 70;
            return _inquirer["default"].prompt([{
              type: 'input',
              name: 'cusPush',
              message: '请输入git命令将文件推送到远程具体分支',
              "default": 'git push orign ' + "".concat(branchName)
            }]);

          case 70:
            _customCommit = _context.sent;
            console.log(_chalk["default"].yellowBright('执行命令：'), _chalk["default"].cyanBright(_customCommit.cusPush));
            (0, _index.execSync)(_customCommit.cusPush);

          case 73:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function push(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var _default = push;
exports["default"] = _default;