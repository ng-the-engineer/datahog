'use strict';

var _dynamodb = require('dynamodb');

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _jobs = require('../throughput/jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _jobs3 = require('../model/jobs');

var _jobs4 = _interopRequireDefault(_jobs3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dynamodb2.default.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001'
});

_jobs4.default.defineJobsTable();

var throughput = {};
throughput['JOBS'] = _jobs2.default.capacity;

_dynamodb2.default.createTables(throughput, function (err) {
  if (err) {
    console.log('Error while creating table', err);
  }

  console.log('Table is created successfully');
});