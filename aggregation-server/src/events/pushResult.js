import events from 'events'
import sendResult from '../services/sendHttpCallback'

const eventEmitter = new events.EventEmitter()
const PUSH_EVENT = 'PUSH_EVENT'

const pushResultHandler = async (payload) => {
  const list = payload.map(item => {
    return {
      requestId: item.attrs.requestId,
      provider: item.attrs.provider,
      result: item.attrs.result
    }
  })
  const requestId = payload[0].attrs.requestId
  const ack = await sendResult({ requestId, payload: list })
  console.log(`${new Date().toISOString()} RequestId: ${requestId} has acknowledged by client (${ack.data.message})`)
}

eventEmitter.on(PUSH_EVENT, pushResultHandler)

module.exports = eventEmitter