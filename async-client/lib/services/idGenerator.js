'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateRequestId = function generateRequestId() {
  return _randomstring2.default.generate({
    length: 5,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  });
};

exports.default = generateRequestId;