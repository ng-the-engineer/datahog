import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import getJobService from './getJob'
import saveJobService from './saveJob'

chai.use(chaiAsPromised)

describe('Service - get job', () => {
  it('should get record successfully if providers have different status', async () => {

    const provider = 'gas'
    const provider2 = 'internet'
    const requestId = Math.floor(Math.random() * Math.floor(999999999)).toString()
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    await saveJobService.saveRecord(provider, requestId, 'DONE', result)
    await saveJobService.saveRecord(provider2, requestId, 'JOB_QUEUED', result)

    const actual = await getJobService.getRecords(requestId)

    expect(actual).to.be.an('object')
    expect(actual.message).to.equal('RECORD_FOUND')
    expect(actual.recordCount).to.equal(2)
    expect(actual.records[0].attrs).to.be.an('object')
    expect(actual.records[0].attrs).to.have.key('id', 'provider', 'requestId', 'status', 'result', 'createdAt')
    expect(actual.records[0].attrs.requestId).to.equal(requestId)
    expect(actual.records[0].attrs.provider).to.equal(provider)
    expect(actual.records[0].attrs.result).to.deep.equal(result)
  })

  it('should get record successfully if providers have same status', async () => {

    const provider = 'gas'
    const provider2 = 'internet'
    const requestId = Math.floor(Math.random() * Math.floor(999999999)).toString()
    const status = 'DONE'
    const result = [
      {
        "billedOn": "2020-02-07T15:03:14.257Z",
        "amount": 15.12
      }
    ]
    await saveJobService.saveRecord(provider, requestId, 'DONE', result)
    await saveJobService.saveRecord(provider2, requestId, 'DONE', result)

    const actual = await getJobService.getRecords(requestId)

    expect(actual).to.be.an('object')
    expect(actual.message).to.equal('RECORD_FOUND')
    expect(actual.recordCount).to.equal(2)
    expect(actual.records[0].attrs).to.be.an('object')
    expect(actual.records[0].attrs).to.have.key('id', 'provider', 'requestId', 'status', 'result', 'createdAt')
    expect(actual.records[0].attrs.requestId).to.equal(requestId)
    expect(actual.records[0].attrs.provider).to.equal(provider)
    expect(actual.records[0].attrs.result).to.deep.equal(result)
  })
})