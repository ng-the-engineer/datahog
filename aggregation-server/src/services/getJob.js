import dynamo from 'dynamodb'
import jobModel from '../persistence/model/jobs'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

const jobRecord = jobModel.defineJobsTable()

const getRecords = (requestId) => {
  return new Promise((resolve, reject) => {
    jobRecord
      .query(requestId)
      .loadAll()
      .exec((err, job) => {
        if(err) return reject(err)
        if(job) {
          return resolve({
              'recordCount': job.Items.length,
              'message': job.Items.length ? 'RECORD_FOUND' : 'RECORD_NOT_FOUND',
              'records': job.Items
            }
          )
        } else {
          return resolve({
            'message': 'RECORD_NOT_FOUND',
          })
        }
      })
  })
} 

module.exports = {
  getRecords
}