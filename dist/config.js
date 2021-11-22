"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _chalk = _interopRequireDefault(require("chalk"));

var _index = require("./utils/index");

var config = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(action) {
    var _len,
        params,
        _key,
        control,
        type,
        v,
        json,
        _json,
        _args = arguments;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            for (_len = _args.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
              params[_key - 1] = _args[_key];
            }

            control = params[0], type = params[1], v = params[2];

            if (control === 'set' || control === 'get') {
              _context.next = 5;
              break;
            }

            console.log(_chalk["default"].red('命令参数不对或者参数丢失'));
            return _context.abrupt("return");

          case 5:
            if (type === 'name' || type === 'password') {
              _context.next = 9;
              break;
            }

            console.log(2);
            console.log(_chalk["default"].red('命令参数不对或者参数丢失'));
            return _context.abrupt("return");

          case 9:
            if (!(control === 'get' && (type === 'name' || type === 'password'))) {
              _context.next = 14;
              break;
            }

            _context.next = 12;
            return (0, _index.getGitFile)();

          case 12:
            json = _context.sent;
            console.log(type + '：' + json[type]);

          case 14:
            if (!(control === 'set' && (type === 'name' || type === 'password') && v)) {
              _context.next = 20;
              break;
            }

            _context.next = 17;
            return (0, _index.getGitFile)();

          case 17:
            _json = _context.sent;
            _json[type] = v;
            console.log(type + '：' + _json[type]);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function config(_x) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = config;