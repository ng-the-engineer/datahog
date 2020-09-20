import chai, {expect} from 'chai'
import queue from './queue'

describe('Messaging - queue', () => {
  it.skip('should create an queue', () => {
    let jobQueue = queue.createQueue('Test-Queue')
    expect(jobQueue).to.be.an('object')
    expect(jobQueue.name).to.equal('Test-Queue')
    expect(jobQueue.settings.activateDelayedJobs).to.equal(true)

  })
})