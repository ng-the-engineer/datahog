import chai from 'chai';
import chaiHttp from 'chai-http';

const {expect} = chai;

chai.use(chaiHttp);

describe('Requests API tests', () => {
  it('POST /requests should return 200 if body has providers', (done) => {
    const reqBody = {
      providers: [
        'gas'
      ]
    }
    chai.request('localhost:3100')
      .post('/api/v1/requests')
      .send(reqBody)
      .end((err, res) => {
        if (err) done (err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('status')
        expect(res.body).to.have.property('requestId')
        done()
      })
  })
})