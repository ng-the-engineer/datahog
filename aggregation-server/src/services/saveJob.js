import dynamo from 'dynamodb'
import jobModel from '../persistence/model/jobs'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
})

const jobRecord = jobModel.defineJobsTable();

const saveRecord = (provider, requestId, status, result) => {

  const newRecord = {
    provider,
    requestId,
    status,
    result
  }

  return new Promise((resolve, reject) => {

    if (newRecord.status==='DONE' && !result) {
      return reject({
        'status': 'FAIL_TO_SAVE',
        'message': 'Result must not be empty if status is DONE'
      })
    }

    jobRecord.create(newRecord, (err, record) => {
      if (err) {
        return reject({
          'status': 'FAIL_TO_SAVE',
          'message': err.message,
        })
      }

      return resolve({
        'status': 'RECORD_SAVED',
        'record': record,
      })
    })
  })
}

module.exports = {
  saveRecord
}