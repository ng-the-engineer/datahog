import chai from 'chai';
import chaiHttp from 'chai-http';

const {expect} = chai;

chai.use(chaiHttp);

describe('Requests API tests', () => {
  it('should return 200 if body and querystring is supplied', (done) => {
    const reqBody = {
      providers: [
        {
          provider: 'gas'
        }
      ]
    }

    chai.request('localhost:3200')
      .post('/api/v1/requests?requestId=123')
      .send(reqBody)
      .end((err, res) =>  {
        if (err) done(err)
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('object')
        expect(res.body).to.have.property('status')
        expect(res.body.status).to.equal('Acknowledged')
        expect(res.body.requestId).to.equal('123')
        done()
      })
  })
})
