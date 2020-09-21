import saveRecord from '../services/saveJob'
import queueUp from '../messaging/mq'

const createJobs = (jobOpts) => {
  const { requestId, providers, callbackUrl } = jobOpts

  try {
    providers.map(item => {
      saveRecord({ requestId, provider: item.provider, callbackUrl })
    })
    
    providers.map(item => {
      const job = queueUp({ requestId, provider: item.provider })
    })
  } catch(err) {
    return {
      status: 'FailToCreateJob',
      requestId: requestId
    }
  }

  return {
    status: 'Acknowledged',
    requestId: requestId
  }
}

export default createJobs