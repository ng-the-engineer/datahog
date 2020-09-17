import dynamo from 'dynamodb'
import jobsThroughput from '../throughput/jobs'
import jobsModel from '../model/jobs'

dynamo.AWS.config.update({
  region: 'local',
  endpoint: 'http://localhost:9001',
});

jobsModel.defineJobsTable();

const throughput = {};
throughput['JOBS'] = jobsThroughput.capacity;

dynamo.createTables(throughput, (err) => {
  if (err) {
    console.log('Error while creating table', err);
  }

  console.log('Table is created successfully');
});