'use strict';

var _dynamodb = require('dynamodb');

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _jobs = require('../schema/jobs');

var _jobs2 = _interopRequireDefault(_jobs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defineJobsTable = function defineJobsTable() {
  return _dynamodb2.default.define('JOB', _jobs2.default.table);
};

module.exports = {
  defineJobsTable: defineJobsTable
};