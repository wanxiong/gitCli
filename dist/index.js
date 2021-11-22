"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _chalk = _interopRequireDefault(require("chalk"));

var _init = _interopRequireDefault(require("./init"));

var _config = _interopRequireDefault(require("./config"));

var _push = _interopRequireDefault(require("./push"));

var _message = _interopRequireDefault(require("./message.js"));

function apply(action, d) {
  for (var _len = arguments.length, params = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    params[_key - 2] = arguments[_key];
  }

  switch (action) {
    case 'init':
      //配置
      (0, _init["default"])(action);
      break;

    case 'config':
      //配置
      _config["default"].apply(void 0, [action].concat(params));

      break;

    case 'push':
      //配置
      _push["default"].apply(void 0, [action, d].concat(params));

      break;

    case 'commit':
      //配置
      _push["default"].apply(void 0, [action, d].concat(params));

      break;

    case 'message':
      _message["default"].apply(void 0, [action, d].concat(params));

      break;

    default:
      _chalk["default"].red("".concat(action, "\u547D\u4EE4\u4E0D\u5B58\u5728"));

      break;
  }
}

module.exports = apply;