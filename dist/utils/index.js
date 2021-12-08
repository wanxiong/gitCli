"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGitFile = createGitFile;
exports.execSync = execSync;
exports.findConfigFile = findConfigFile;
exports.getGitFile = getGitFile;
exports.getHeadBranch = getHeadBranch;
exports.getJiraData = void 0;
exports.getLocalConfigFile = getLocalConfigFile;
exports.writeData = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _constants = require("./constants");

var _chalk = _interopRequireDefault(require("chalk"));

var _child_process = _interopRequireDefault(require("child_process"));

var _ora = _interopRequireDefault(require("ora"));

var _jiraAccount = require("./jiraAccount");

var spinner = (0, _ora["default"])('Loading');

function getGitFile() {
  return _getGitFile.apply(this, arguments);
}

function _getGitFile() {
  _getGitFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", new Promise(function (resolve, reject) {
              _fs["default"].readFile(_path["default"].resolve(__dirname, '../', _constants.pathUrl), 'utf-8', function (err, data) {
                if (err) {
                  console.log(_chalk["default"].red('初始化文件错误，请重新初始化命令 <mdmCommit init>'));
                  throw err;
                }

                resolve(JSON.parse(data));
              });
            }));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _getGitFile.apply(this, arguments);
}

function createGitFile(_x) {
  return _createGitFile.apply(this, arguments);
}

function _createGitFile() {
  _createGitFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(data) {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", new Promise(function (resolve, reject) {
              _fs["default"].writeFile(_path["default"].resolve(__dirname, '../', _constants.pathUrl), JSON.stringify(data, null, '\t'), {}, function (err) {
                if (err) {
                  throw err;
                } // console.log('文件写入成功')


                // console.log('文件写入成功')
                resolve();
              });
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _createGitFile.apply(this, arguments);
}

function execSync(cmd, stdio, cwd) {
  if (!cwd) cwd = process.cwd();
  if (!stdio) stdio = 'inherit';

  try {
    var res = _child_process["default"].execSync(cmd, {
      stdio: stdio,
      encoding: 'utf8',
      cwd: cwd
    });

    if (res) return res.toString().trim();
    return res;
  } catch (error) {
    // console.log(error)
    // 1的时候commit 没有变更
    if (error.status !== 1) {
      throw new Error(_chalk["default"].bgRed('异常中断code=' + error.status + '\n' + error));
    }

    return null;
  }
}
/** 获取本地分支名 */


function getHeadBranch(cwd) {
  var file = findConfigFile(cwd, './.git/HEAD');
  var baseDir = process.cwd();
  var head = null;

  if (file.hasFile) {
    head = _fs["default"].readFileSync(file.url, {
      encoding: 'utf-8'
    });
  } else {
    head = _fs["default"].readFileSync(_path["default"].resolve(baseDir, './.git/HEAD'), {
      encoding: 'utf-8'
    });
  }

  var branch = head.split('refs/heads/')[1];

  if (!branch) {
    // exec 速度比较慢
    branch = execSync('git rev-parse --abbrev-ref HEAD', 'pipe');
  }

  return branch.trim();
} // 连接jira账号并获取对应的数据 && 写入文件


var writeData = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(fileData, designatedBoard, localConfig) {
    var data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            spinner.color = 'yellow';
            spinner.start('获取关联的jira账号');
            _context.prev = 2;
            _context.next = 5;
            return (0, _jiraAccount.initAccount)({
              name: fileData.name,
              password: fileData.password,
              delay: 2000,
              designatedBoard: designatedBoard || localConfig.Board || _constants.defaultBoard
            });

          case 5:
            data = _context.sent;
            fileData.baseData = data; // 2小时过期

            fileData.expirationTime = 7200 * 1000;
            fileData.startTime = +new Date();
            fileData.boardType = designatedBoard || localConfig.Board || _constants.defaultBoard;
            _context.next = 12;
            return createGitFile(fileData);

          case 12:
            spinner.succeed('获取jira账号成功');
            return _context.abrupt("return", data);

          case 16:
            _context.prev = 16;
            _context.t0 = _context["catch"](2);
            spinner.stop(_chalk["default"].red('异常终止获取jira数据'));
            throw new Error(_context.t0);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[2, 16]]);
  }));

  return function writeData(_x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * 
*/


exports.writeData = writeData;

var getJiraData = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(fileData, designatedBoard) {
    var localConfig,
        data,
        nowData,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            localConfig = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
            data = null; // 存在过期时间

            if (!(fileData.expirationTime && fileData.startTime)) {
              _context2.next = 22;
              break;
            }

            if (!(designatedBoard === fileData.boardType)) {
              _context2.next = 16;
              break;
            }

            // 看板类型相同 直接读取输
            nowData = +new Date();

            if (!(nowData - Number(fileData.startTime) > Number(fileData.expirationTime))) {
              _context2.next = 12;
              break;
            }

            // 重新获取
            console.log(_chalk["default"].greenBright('重新获取jira信息...'));
            _context2.next = 9;
            return writeData(fileData, designatedBoard, localConfig);

          case 9:
            data = _context2.sent;
            _context2.next = 14;
            break;

          case 12:
            // 缓存中获取
            console.log(_chalk["default"].greenBright('从缓存中获取jira信息...'));
            data = fileData.baseData;

          case 14:
            _context2.next = 20;
            break;

          case 16:
            // 需要重新获取
            console.log(_chalk["default"].greenBright('看板模块切换，重新获取jira信息...'));
            _context2.next = 19;
            return writeData(fileData, designatedBoard, localConfig);

          case 19:
            data = _context2.sent;

          case 20:
            _context2.next = 26;
            break;

          case 22:
            console.log(_chalk["default"].greenBright('初次获取jira信息...'));
            _context2.next = 25;
            return writeData(fileData, designatedBoard, localConfig);

          case 25:
            data = _context2.sent;

          case 26:
            return _context2.abrupt("return", data);

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getJiraData(_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}(); // 查找指定文件是否存在


exports.getJiraData = getJiraData;

function findConfigFile(dirname, fileName) {
  var basePath = '../';
  var maxLevel = 5;
  var index = 0;
  var d = false;
  var url = '';

  while (!d && index < maxLevel) {
    var arr = [];

    for (var i = 0; i < index; i++) {
      arr.push(basePath);
    }

    url = _path["default"].resolve(dirname, arr.join(''), fileName);
    index++;
    d = _fs["default"].existsSync(url);
  }

  return {
    hasFile: d,
    url: url
  };
} // 获取本地文件


function getLocalConfigFile(_x7, _x8) {
  return _getLocalConfigFile.apply(this, arguments);
}

function _getLocalConfigFile() {
  _getLocalConfigFile = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(dirname, fileName) {
    var file, d;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            file = findConfigFile(dirname, fileName);

            if (!file.hasFile) {
              _context5.next = 6;
              break;
            }

            _context5.next = 4;
            return new Promise(function (resolve, reject) {
              _fs["default"].readFile(file.url, 'utf-8', function (err, data) {
                if (err) {
                  console.log(_chalk["default"].red('初始化文件错误，请重新初始化命令 <mdmCommit init>'));
                  throw err;
                }

                try {
                  resolve(JSON.parse(data));
                } catch (error) {
                  resolve({});
                }
              });
            });

          case 4:
            d = _context5.sent;
            return _context5.abrupt("return", d);

          case 6:
            return _context5.abrupt("return", {});

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _getLocalConfigFile.apply(this, arguments);
}