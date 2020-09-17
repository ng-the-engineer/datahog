'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;


_chai2.default.use(_chaiHttp2.default);

describe('Callback API tests', function () {
  it('POST /callback should return 200 if body and querystring is supplied', function (done) {

    var reqBody = {
      provider: 'gas',
      records: []
    };

    _chai2.default.request('localhost:3100').post('/api/v1/callback?requestId=123').send(reqBody).end(function (err, res) {
      if (err) done(err);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('provider');
      expect(res.body).to.have.property('records');
      done();
    });
  });
});