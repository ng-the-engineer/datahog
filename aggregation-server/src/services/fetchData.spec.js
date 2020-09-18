import chai, {expect} from 'chai'
import chaiAsPromised from 'chai-as-promised'
import getJobService from './getJob'
import saveJobService from './saveJob'
import fetchDataService from './fetchData'

chai.use(chaiAsPromised)

describe('Service - fetch data', () => {
  it('should return fail or success with data attribute', async () => {
    const actual = await fetchDataService.fetchUrl('gas')
    if(actual.status===500) {
      expect(actual.data).to.equal('#fail')
    } else if (actual.status===200) {
      expect(actual.data).to.be.an('array')
      expect(actual.data.length).to.equal(2)
      expect(actual.data[0]).to.have.key('billedOn', 'amount')
    }
  })

  it('should return error if provider is missing', async () => {
    await expect(fetchDataService.fetchUrl()).to.be.rejectedWith(Error)
  })
})