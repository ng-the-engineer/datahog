import koaRouter from "koa-router"
import createJobs from '../controllers/datahog'
import config from '../config'

const router = koaRouter()
const baseUrl = config.baseUrl

router.post(`${baseUrl}/requests`, async (ctx) => {
  const requestId = ctx.query.requestId
  const providers = ctx.request.body.providers
  const callbackUrl = ctx.request.body.callbackUrl

  ctx.assert(requestId, 422, 'Query parameter "requestId" is mandatory')
  ctx.assert(providers, 422, 'Body parameter "providers" is mandatory')
  ctx.assert(callbackUrl, 422, 'Body parameter "callbackUrl" is mandatory')

  try {
    const record = createJobs({ requestId, providers, callbackUrl })
    createResponse({ ctx, body: record, status: 200 })
  } catch (err) {
    createResponse({ ctx, body: err, status: 400})
  }
})

const createResponse = (context) => {
  const { ctx, body, status} = context
  ctx.body = body
  ctx.status = status
}
export default router