import dynamo from 'dynamodb'
import jobModel from '../persistence/model/jobs'
import getJobService from './getJob'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

const jobRecord = jobModel.defineJobsTable()

const updateRecord = (provider, requestId, status, result) => {
  const modifiedRecord = {
    provider,
    requestId,
    status,
    result: !result ? [] : result
  }

  return new Promise((resolve, reject) => {
    if(!modifiedRecord.status) {
      return reject({
        'status': 'FAIL_TO_UPDATE',
        'message': 'Status must not be empty when a record is updated',
      })
    }
    
    jobRecord.update(modifiedRecord, (err, record) => {
      if (err) {
        return reject({
          'status': 'FAIL_TO_UPDATE',
          'message': err.message,
        })
      }

      return resolve({
        'status': 'RECORD_UPDATED',
        'record': record,
      })
    })
  })
}

module.exports = {
  updateRecord
}