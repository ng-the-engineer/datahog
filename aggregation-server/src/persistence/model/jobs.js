import dynamo from 'dynamodb'
import jobSchema from '../schema/jobs'

const defineJobsTable = () => {
  return dynamo.define('JOB', jobSchema.table);
};

module.exports = {
  defineJobsTable,
};