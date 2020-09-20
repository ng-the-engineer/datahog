import getJobsTable from '../persistence/model/jobs'
import setAwsRegion from '../utils/setAwsRegion'

setAwsRegion()

const updateRecord = ({ requestId, provider, status, result }) => {
  const modifiedRecord = {
    requestId,
    provider,
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
    
    getJobsTable().update(modifiedRecord, (err, record) => {
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

export default updateRecord