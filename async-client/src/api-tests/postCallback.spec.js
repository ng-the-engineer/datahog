import chai from 'chai'
import chaiHttp from 'chai-http'

const {expect} = chai

chai.use(chaiHttp)

describe('Callback API tests', () => {
  it('POST /callback should return 200 if body and querystring is supplied', (done) => {

    const reqBody = [{
      provider: 'gas',
      records: []
    }]

    chai.request('localhost:3100')
      .post('/api/v1/callback?requestId=123')
      .send(reqBody)
      .end((err, res) => {
        if (err) done (err)
        expect(res).to.have.status(200)
        // expect(res.body).to.be.an('array')
        expect(res.body.message).to.equal('CALLBACK_ACKNOWLEDGED')
        // expect(res.body).to.have.property('provider')
        // expect(res.body).to.have.property('records')
        done()
      })
  })
})