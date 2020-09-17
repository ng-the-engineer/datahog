'use strict';

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiHttp = require('chai-http');

var _chaiHttp2 = _interopRequireDefault(_chaiHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;


_chai2.default.use(_chaiHttp2.default);

describe('Requests API tests', function () {
  it('should return 200 if body and querystring is supplied', function (done) {
    var reqBody = {
      providers: [{
        provider: 'gas'
      }]
    };

    _chai2.default.request('localhost:3200').post('/api/v1/requests?requestId=123').send(reqBody).end(function (err, res) {
      if (err) done(err);
      console.log('res:', res);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('Acknowledged');
      expect(res.body.requestId).to.equal('123');
      done();
    });
  });
});