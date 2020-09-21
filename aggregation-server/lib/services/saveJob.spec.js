'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiAsPromised = require('chai-as-promised');

var _chaiAsPromised2 = _interopRequireDefault(_chaiAsPromised);

var _saveJob = require('./saveJob');

var _saveJob2 = _interopRequireDefault(_saveJob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.use(_chaiAsPromised2.default);

describe('Service - save job', function () {
  it('should save the record successfully if provider, requestId, status, result is supplied', async function () {

    var provider = 'gas';
    var requestId = '128';
    var status = 'DONE';
    var result = [{
      "billedOn": "2020-02-07T15:03:14.257Z",
      "amount": 15.12
    }];
    var callbackUrl = 'http://localhost:3100/api/v1/callback';
    var actual = await (0, _saveJob2.default)({ requestId: requestId, provider: provider, status: status, result: result, callbackUrl: callbackUrl });

    (0, _chai.expect)(actual).to.be.an('object');
    (0, _chai.expect)(actual).to.have.property('status');
    (0, _chai.expect)(actual).to.have.property('record');
    (0, _chai.expect)(actual.status).to.equal('RECORD_SAVED');
    (0, _chai.expect)(actual.record.attrs).to.be.an('object');
    (0, _chai.expect)(actual.record.attrs).to.have.key('provider', 'requestId', 'status', 'result', 'id', 'createdAt', 'callbackUrl');
    (0, _chai.expect)(actual.record.attrs.provider).to.equal('gas');
    (0, _chai.expect)(actual.record.attrs.requestId).to.equal('128');
    (0, _chai.expect)(actual.record.attrs.status).to.equal('DONE');
    (0, _chai.expect)(actual.record.attrs.result).to.deep.equal(result);
  });

  it('should fail to save if provider is missing', async function () {
    var provider = null;
    var requestId = '130';
    var status = 'DONE';
    var result = [{
      "billedOn": "2020-02-07T15:03:14.257Z",
      "amount": 15.12
    }];
    return (0, _chai.expect)((0, _saveJob2.default)({ requestId: requestId, provider: provider, status: status, result: result })).to.be.rejected;
  });

  it('should fail to save if requestId is missing', async function () {
    var provider = 'internet';
    var requestId = null;
    var status = 'JOB_QUEUED';
    var result = [{
      "billedOn": "2020-02-07T15:03:14.257Z",
      "amount": 15.12
    }];
    var callbackUrl = 'http://localhost:3100/api/v1/callback';
    return (0, _chai.expect)((0, _saveJob2.default)({ requestId: requestId, provider: provider, status: status, result: result, callbackUrl: callbackUrl })).to.be.rejected;
  });

  it('should fail to save if status is missing', async function () {
    var provider = 'internet';
    var requestId = '140';
    var status = null;
    var result = [{
      "billedOn": "2020-02-07T15:03:14.257Z",
      "amount": 15.12
    }];
    var callbackUrl = 'http://localhost:3100/api/v1/callback';
    return (0, _chai.expect)((0, _saveJob2.default)(requestId, provider, status, result, callbackUrl)).to.be.rejected;
  });

  it('should save the record successfully if result is missing and status is not DONE', async function () {
    var provider = 'internet';
    var requestId = '140';
    var status = 'JOB_QUEUED';
    var result = null;
    var callbackUrl = 'http://localhost:3100/api/v1/callback';

    var actual = await (0, _saveJob2.default)({ requestId: requestId, provider: provider, status: status, result: result, callbackUrl: callbackUrl });

    (0, _chai.expect)(actual).to.be.an('object');
    (0, _chai.expect)(actual).to.have.property('status');
    (0, _chai.expect)(actual).to.have.property('record');
    (0, _chai.expect)(actual.status).to.equal('RECORD_SAVED');
    (0, _chai.expect)(actual.record.attrs).to.be.an('object');
  });

  it('should fail to save if result is missing and status is DONE', async function () {
    var provider = 'internet';
    var requestId = '140';
    var status = 'DONE';
    var result = null;
    var callbackUrl = 'http://localhost:3100/api/v1/callback';

    return (0, _chai.expect)((0, _saveJob2.default)({ requestId: requestId, provider: provider, status: status, result: result, callbackUrl: callbackUrl })).to.be.rejectedWith('Result must not be empty if status is DONE');
  });
});