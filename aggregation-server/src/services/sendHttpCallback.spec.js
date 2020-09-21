import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sendResult from './sendHttpCallback'

chai.use(chaiAsPromised)

describe('Service - send HTTP callback', () => {
  it('should return 200', async () => {
    const actual = await sendResult({ 
      requestId: 'AAAA', 
      payload: [
        {
          provider: 'gas'
        }
      ],
      callbackUrl: 'http://localhost:3100/api/v1/callback'
    })
    expect(actual.data.message).to.equal('CALLBACK_ACKNOWLEDGED')
  })
})
