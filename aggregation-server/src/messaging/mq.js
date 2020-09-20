import Queue from 'bee-queue'
import axios from 'axios'
import eventEmitter from '../events/pushResult'
import updateRecord from '../services/updateJob'
import getRecords from '../services/getJob'
import config from '../config'

const queue = new Queue('QUEUE_01', { activateDelayedJobs: true })
const PUSH_EVENT = 'PUSH_EVENT'

const queueUp = async (payload) => {
  const job = await queue.createJob(payload)
    .backoff('fixed', config.jobRetryInterval)
    .retries(config.jobRetryCount)
    .save()
  console.info(`${new Date().toISOString()} JobId: ${job.id} queued up with payload ${payload}`)

  job.on('succeeded', async function (result) {
    try {
      console.log(`${new Date().toISOString()} JobId: ${job.id} received result: ${JSON.stringify(result, null, 5)}`);
      await updateRecord({ requestId: payload.requestId, provider: payload.provider, status: 'RETRIEVED', result })
      const jobs = await getRecords(payload.requestId)
      pushResultIfAllJobsDone({ jobs, jobId: job.id })
    } catch (err) {
      console.error('Update job error', err)
    }
  });

  job.on('retrying', (err) => {
    console.log(`${new Date().toISOString()} JobId: ${job.id} is being retried! (${job.options.retries})`)
  })

  return job
}

queue.process((job, done) => {
  axios.get(`http://${config.dataServer.host}:${config.dataServer.port}/providers/${job.data.provider}`)
    .then(res => {
      console.log(`${new Date().toISOString()} JobId: ${job.id} has processed with status: ${res.status}`)
      return done(null, res.data)
    })
    .catch(function(err) {
      console.error(`${new Date().toISOString()} JobId: ${job.id} failed with status: ${err.response.status}`)
      return done(Error)
    })
})

const isRequestFulfilled = (jobs) => {
  const totalJobs = jobs.length
  const finishedJobs = jobs.filter(item => item.attrs.status==='RETRIEVED').length
  return totalJobs===finishedJobs
}

const pushResultIfAllJobsDone = (input) => {
  const { jobs, jobId } = input
  if (isRequestFulfilled(jobs.records)) {
    eventEmitter.emit(PUSH_EVENT, jobs.records)
    console.log(`${new Date().toISOString()} JobId: ${jobId} is ready to send callback`)
  }
}
export default queueUp