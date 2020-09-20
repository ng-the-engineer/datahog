const dynamo = require('dynamodb')
const getJobsTable = require('./persistence/model/jobs')

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

// const jobRecord = jobModel.defineJobsTable()
const jobRecord = getJobsTable()

const requestId = '680'

jobRecord
  .query(requestId)
  .loadAll()
  .exec((err, job) => {
    if(err) {
      console.log('err:', err)
    }
    if(job) {
      console.log('job records:', job.Items.length)
      // job.Items.map(item => {
      //   console.log('item:', item.attrs)
      // })

      const retrievedItems = job.Items.filter(item => item.attrs.status==='RETRIEVED')
      console.log('retrievedItems=', retrievedItems.length)

      // return resolve({
      //     'recordCount': job.Items.length,
      //     'message': job.Items.length ? 'RECORD_FOUND' : 'RECORD_NOT_FOUND',
      //     'records': job.Items
      //   }
      // )
    } else {
      // return resolve({
      //   'message': 'RECORD_NOT_FOUND',
      // })
      console.log('job is null')
    }
  })