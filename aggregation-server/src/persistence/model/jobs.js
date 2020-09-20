import dynamo from 'dynamodb'
import table from '../schema/jobs'

const getJobsTable = () => {
  return dynamo.define('JOB', table);
}

export default getJobsTable