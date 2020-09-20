import randomString from 'randomstring'

const generateRequestId = () => {
  return randomString.generate({
    length: 5,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  })
}

export default generateRequestId