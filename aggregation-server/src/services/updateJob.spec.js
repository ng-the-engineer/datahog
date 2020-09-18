import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import updateJobService from './updateJob'
import saveJobService from './saveJob'

chai.use(chaiAsPromised)

describe('Service - update job', () => {
  it('should update the record successfully if provider, requestId, status and result is supplied', async () => {
    const provider = 'gas'
    const requestId = '600'
    const status = 'JOB_QUEUED'
    const result = [
      {
        "billedOn": "2020-09-18T07:18:50.889Z",
        "amount": 980.12
      }
    ]
    await saveJobService.saveRecord(provider, requestId, status, result)
    
    const updatedStatus = 'DONE'
    const updatedResult = [
      {
        "billedOn": "2020-09-18T07:18:50.889Z",
        "amount": 980.12
      },
      {
        "billedOn": "2020-09-19T07:18:50.889Z",
        "amount": 7.00
      }
    ]

    const actual = await updateJobService.updateRecord(provider, requestId, updatedStatus, updatedResult)
    expect(actual).to.have.property('status')
    expect(actual).to.have.property('record')
    expect(actual.status).to.equal('RECORD_UPDATED')
    expect(actual.record.attrs).to.be.an('object')
    expect(actual.record.attrs).to.have.key('provider', 'requestId', 'status', 'result', 'id', 'createdAt', 'updatedAt')
    expect(actual.record.attrs.provider).to.equal(provider)
    expect(actual.record.attrs.requestId).to.equal(requestId)
    expect(actual.record.attrs.status).to.equal(updatedStatus)
    expect(actual.record.attrs.result).to.deep.equal(updatedResult)
  })

  it('should fail to update if provider is missing', async () => {
    const provider = null
    const requestId = '600'
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(updateJobService.updateRecord(provider, requestId, status, result)).to.be.rejected
  })

  it('should fail to update if requestId is missing', async () => {
    const provider = 'gas'
    const requestId = null
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(updateJobService.updateRecord(provider, requestId, status, result)).to.be.rejected
  })

  it('should fail to update if status is missing', async () => {
    const provider = 'gas'
    const requestId = '600'
    const status = null
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    return expect(updateJobService.updateRecord(provider, requestId, status, result)).to.be.rejectedWith('Status must not be empty when a record is updated')
  })

  it('should fail to update if result is missing', async () => {
    const provider = 'gas'
    const requestId = '600'
    const status = 'JOB_QUEUED'
    const result = null
    const updatedResult = []
    const actual = await updateJobService.updateRecord(provider, requestId, status, result)
    expect(actual).to.have.property('status')
    expect(actual).to.have.property('record')
    expect(actual.status).to.equal('RECORD_UPDATED')
    expect(actual.record.attrs).to.be.an('object')
    expect(actual.record.attrs).to.have.key('provider', 'requestId', 'status', 'result', 'id', 'createdAt', 'updatedAt')
    expect(actual.record.attrs.provider).to.equal(provider)
    expect(actual.record.attrs.requestId).to.equal(requestId)
    expect(actual.record.attrs.status).to.equal(status)
    expect(actual.record.attrs.result).to.deep.equal(updatedResult)
  })

  it.skip('should fail to update if provider and requestId is not find', async () => {
    const provider = 'unknown'
    const requestId = '99999'
    const status = 'JOB_QUEUED'
    const result = null
    const updatedResult = []
    const actual = await updateJobService.updateRecord(provider, requestId, status, result)
    // expect(actual).to.have.property('status')
    // expect(actual).to.have.property('record')
    // expect(actual.status).to.equal('RECORD_UPDATED')
    // expect(actual.record.attrs).to.be.an('object')
    // expect(actual.record.attrs).to.have.key('provider', 'requestId', 'status', 'result', 'id', 'createdAt', 'updatedAt')
    // expect(actual.record.attrs.provider).to.equal(provider)
    // expect(actual.record.attrs.requestId).to.equal(requestId)
    // expect(actual.record.attrs.status).to.equal(status)
    // expect(actual.record.attrs.result).to.deep.equal(updatedResult)
  })
})