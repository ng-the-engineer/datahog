import koaRouter from "koa-router"
import requestToAggregationServer from '../services/requestServer'
import generateRequestId from '../services/idGenerator'
import config from '../config'

const router = koaRouter()
const baseUrl = config.baseUrl

router.post(`${baseUrl}/requests`, async (ctx) => {
  const payload = ctx.request.body;
  ctx.assert(payload.providers, 422, 'Body parameter providers is mandatory');
  const requestId = generateRequestId()
  try {
    await requestToAggregationServer({ requestId, payload })
    console.info(`${new Date().toISOString()} requestId: ${requestId} placed request`)
    createResponse({ ctx, body: { status: 'REQUEST_PLACED', requestId}, status: 200 })
  } catch (err) {
    createResponse({ ctx, body: err, status: 400})
  }
})

router.post(`${baseUrl}/callback`, async (ctx) => {
  const payload = ctx.request.body
  const request = ctx.query
  ctx.assert(Array.isArray(payload), 422, 'Body require an array')
  ctx.assert(request.requestId, 422, 'Query parameter "requestId" is mandatory');
  try {
    console.info(`${new Date().toISOString()} requestId: ${request.requestId} received callback: ${JSON.stringify(payload, null, 5)}`)
    createResponse({ ctx, body: { message: 'CALLBACK_ACKNOWLEDGED' }, status: 200})
  } catch (err) {
    createResponse({ ctx, body: err, status: 400})
  }
})

const createResponse = ((context) => {
  const {ctx, body, status} = context
  ctx.body = body
  ctx.status = status
})

export default router