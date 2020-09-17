import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import saveJobService from './saveJob'

chai.use(chaiAsPromised)

describe('Service - save job', () => {
  it('should save the record successfully if provider, requestId, status, result is supplied', async () => {

    const provider = 'gas'
    const requestId = '128'
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    const actual = await saveJobService.saveRecord(provider, requestId, status, result)

    expect(actual).to.be.an('object')
    expect(actual).to.have.property('status')
    expect(actual).to.have.property('record')
    expect(actual.status).to.equal('RECORD_SAVED')
    expect(actual.record.attrs).to.be.an('object')
    expect(actual.record.attrs).to.have.key('provider', 'requestId', 'status', 'result', 'id', 'createdAt')
    expect(actual.record.attrs.provider).to.equal('gas')
    expect(actual.record.attrs.requestId).to.equal('128')
    expect(actual.record.attrs.status).to.equal('DONE')
    expect(actual.record.attrs.result).to.deep.equal(result)
  })

  it('should fail to save if provider is missing', async () => {
    const provider = null
    const requestId = '130'
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(saveJobService.saveRecord(provider, requestId, status, result)).to.be.rejected
  })

  it('should fail to save if requestId is missing', async () => {
    const provider = 'internet'
    const requestId = null
    const status = 'JOB_QUEUED'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(saveJobService.saveRecord(provider, requestId, status, result)).to.be.rejected
  })

  it('should fail to save if status is missing', async () => {
    const provider = 'internet'
    const requestId = '140'
    const status = null
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(saveJobService.saveRecord(provider, requestId, status, result)).to.be.rejected
  })

  it('should save the record successfully if result is missing and status is not DONE', async () => {
    const provider = 'internet'
    const requestId = '140'
    const status = 'JOB_QUEUED'
    const result = null

    const actual = await saveJobService.saveRecord(provider, requestId, status, result)

    expect(actual).to.be.an('object')
    expect(actual).to.have.property('status')
    expect(actual).to.have.property('record')
    expect(actual.status).to.equal('RECORD_SAVED')
    expect(actual.record.attrs).to.be.an('object')
  })

  it('should fail to save if result is missing and status is DONE', async () => {
    const provider = 'internet'
    const requestId = '140'
    const status = 'DONE'
    const result = null

    return expect(saveJobService.saveRecord(provider, requestId, status, result)).to.be.rejectedWith('Result must not be empty if status is DONE')
  })
})

