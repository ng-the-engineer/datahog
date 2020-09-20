import dynamo from 'dynamodb'
import capacity from '../throughput/jobs'
import getJobsTable from '../model/jobs'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
});

// jobsModel.defineJobsTable();
getJobsTable()

const throughput = {};
throughput['JOBS'] = capacity;

dynamo.createTables(throughput, (err) => {
  if (err) {
    console.log('Error while creating table', err);
  }

  console.log('Table is created successfully');
});