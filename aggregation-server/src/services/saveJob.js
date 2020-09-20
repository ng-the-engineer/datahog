import getJobsTable from '../persistence/model/jobs'
import setAwsRegion from '../utils/setAwsRegion'

setAwsRegion()

const saveRecord = (input) => {
  const { requestId, provider, status, result } = input
  const newRecord = {
    requestId,
    provider,
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

    getJobsTable().create(newRecord, (err, record) => {
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

export default saveRecord