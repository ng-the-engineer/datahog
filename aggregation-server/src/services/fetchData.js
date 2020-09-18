import axios from 'axios'

const fetchUrl = async (provider) => {
  if(!provider) throw new Error('Parameter provider is mandatory')
  
  try {
    const response = await axios.get(`http://localhost:3000/providers/${provider}`);
    return({
      status: response.status,
      data: response.data 
    })
  } catch (error) {
      return ({
        status: error.response.status,
        data: error.response.data
      })
  }
}

module.exports = {
  fetchUrl
}