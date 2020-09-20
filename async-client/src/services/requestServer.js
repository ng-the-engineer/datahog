import axios from 'axios'

const requestToAggregationServer = async (input) => {
  const { requestId, payload } = input
  try {
    const ack = await axios.post(`http://localhost:3200/api/v1/requests?requestId=${requestId}`, payload)
  } catch (err) {
    console.log('err:', err)
  }
}

export default requestToAggregationServer