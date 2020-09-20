import dynamo from 'dynamodb'

const setAwsRegion = () => {
  dynamo.AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:9001',
  })
}

export default setAwsRegion