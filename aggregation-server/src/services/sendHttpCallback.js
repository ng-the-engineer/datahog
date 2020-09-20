import axios from 'axios'

const sendResult = async (input) => {
  const { requestId, payload } = input 
  try {
    const ack = await axios.post(`http://localhost:3100/api/v1/callback?requestId=${requestId}`, payload)
    return ack
  } catch (err) {
    console.log('err', err)
  } 
}

export default sendResult