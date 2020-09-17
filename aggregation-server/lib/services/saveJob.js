'use strict';

var _dynamodb = require('dynamodb');

var _dynamodb2 = _interopRequireDefault(_dynamodb);

var _jobs = require('../persistence/model/jobs');

var _jobs2 = _interopRequireDefault(_jobs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dynamodb2.default.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001'
});

var jobRecord = _jobs2.default.defineJobsTable();

var saveRecord = function saveRecord(provider, requestId, status, result) {

  var newRecord = {
    provider: provider,
    requestId: requestId,
    status: status,
    result: result
  };

  return new Promise(function (resolve, reject) {

    if (newRecord.status === 'DONE' && !result) {
      return reject({
        'status': 'FAIL_TO_SAVE',
        'message': 'Result must not be empty if status is DONE'
      });
    }

    jobRecord.create(newRecord, function (err, record) {
      if (err) {
        return reject({
          'status': 'FAIL_TO_SAVE',
          'message': err.message
        });
      }

      return resolve({
        'status': 'RECORD_SAVED',
        'record': record
      });
    });
  });
};

module.exports = {
  saveRecord: saveRecord
};