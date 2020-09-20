import getJobsTable from '../persistence/model/jobs'
import setAwsRegion from '../utils/setAwsRegion'

setAwsRegion()

const getRecords = (requestId) => {
  return new Promise((resolve, reject) => {
    getJobsTable()
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

export default getRecords