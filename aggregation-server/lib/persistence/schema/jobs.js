'use strict';

var _dynamodb = require('dynamodb');

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var table = {
  hashKey: 'provider',
  rangeKey: 'requestId',
  schema: {
    id: _dynamodb2.default.types.uuid(),
    provider: _joi2.default.string(),
    requestId: _joi2.default.string(),
    status: _joi2.default.string(),
    result: _joi2.default.any(),
    time: _joi2.default.date().timestamp()
  }
};

module.exports = {
  table: table
};