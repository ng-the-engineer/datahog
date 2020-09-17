'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;


_chai2.default.use(_chaiHttp2.default);

describe('Requests API tests', function () {
  it('POST /requests should return 200 if body has providers', function (done) {
    var reqBody = {
      providers: ['gas']
    };
    _chai2.default.request('localhost:3100').post('/api/v1/requests').send(reqBody).end(function (err, res) {
      if (err) done(err);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('requestId');
      done();
    });
  });
});