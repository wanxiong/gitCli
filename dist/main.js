"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _commander = _interopRequireDefault(require("commander"));

var _constants = require("./utils/constants");

var _index = _interopRequireDefault(require("./index"));

var actionMap = {
  init: {
    alias: 'I',
    // 别名
    description: '初始化配置',
    // 描述
    usages: ['mdmGit init']
  },
  config: {
    alias: 'C',
    // 别名
    description: '设置或者得到邮箱和密码',
    // 描述
    usages: ['mdmGit config set name <val>', 'mdmGit config set password <val>', 'mdmGit config get name', 'mdmGit config get password']
  },
  push: {
    alias: 'P',
    // 别名
    description: '提交并推送代码',
    // 描述
    usages: ['mdmGit push', 'mdmGit push -d [options]', 'mdmGit push -a'],
    option: [['-d, --designated-board [--designated-doard]', '指定看板的模块', _constants.defaultBoard], ['-a, --all-data', '看到所有数据', false]]
  },
  commit: {
    alias: 'C',
    // 别名
    description: '提交代码',
    // 描述
    usages: ['mdmGit commit', 'mdmGit commit -d [options]', 'mdmGit commit -a'],
    option: [['-d, --designated-board [--designated-doard]', '指定看板的模块', _constants.defaultBoard], ['-a, --all-data', '看到所有数据', false]]
  },
  message: {
    alias: 'M',
    // 别名
    description: '获取提交commit信息',
    // 描述
    usages: ['mdmGit message', 'mdmGit message -d [options]', 'mdmGit message -a'],
    option: [['-d, --designated-board [--designated-doard]', '指定看板的模块', _constants.defaultBoard], ['-a, --all-data', '看到所有数据', false]]
  }
}; // 添加 init / config 命令

Object.keys(actionMap).forEach(function (action) {
  var command = _commander["default"].command(action) //配置命令的名字
  .description(actionMap[action].description) // 描述
  .alias(actionMap[action].alias) //别名
  .action(function (d) {
    // 动作
    _index["default"].apply(void 0, [action, d].concat((0, _toConsumableArray2["default"])(process.argv.slice(3))));
  });

  if (actionMap[action].option) {
    actionMap[action].option.forEach(function (item) {
      command.option.apply(command, (0, _toConsumableArray2["default"])(item));
    });
  }
}); //

function help() {
  console.log('\r\nUsage:');
  Object.keys(actionMap).forEach(function (action) {
    actionMap[action].usages.forEach(function (usage) {
      console.log('  - ' + usage);
    });
  });
}

_commander["default"].usage('<command> [options]'); // eos -h 


_commander["default"].on('-h', help);

_commander["default"].on('--help', help); // eos -V   VERSION 为 package.json 中的版本号


_commander["default"].version(_constants.VERSION, '-V --version').parse(process.argv);