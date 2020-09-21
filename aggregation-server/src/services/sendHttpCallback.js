import axios from 'axios'

const sendResult = async (input) => {
  const { requestId, payload, callbackUrl } = input
  try {
    const ack = await axios.post(`${callbackUrl}?requestId=${requestId}`, payload)
    return ack
  } catch (err) {
    console.log('err', err.code)
  } 
}

export default sendResult