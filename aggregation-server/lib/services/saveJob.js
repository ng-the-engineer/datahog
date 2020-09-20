'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jobs = require('../persistence/model/jobs');

var _jobs2 = _interopRequireDefault(_jobs);

var _setAwsRegion = require('../utils/setAwsRegion');

var _setAwsRegion2 = _interopRequireDefault(_setAwsRegion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setAwsRegion2.default)();

var saveRecord = function saveRecord(input) {
  var requestId = input.requestId,
      provider = input.provider,
      status = input.status,
      result = input.result;

  var newRecord = {
    requestId: requestId,
    provider: provider,
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

    (0, _jobs2.default)().create(newRecord, function (err, record) {
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

exports.default = saveRecord;