import koaRouter from "koa-router"
import Router from "koa-router"

const router = koaRouter()
const baseUrl = '/api/v1'

router.get(`${baseUrl}`, async (ctx) => {
  ctx.body = {
    'message': 'Hello world'
  }
})

router.post(`${baseUrl}/requests`, async (ctx) => {
  const body = ctx.request.body
  const request = ctx.query

  ctx.assert(request.requestId, 422, 'Query parameter "requestId" is mandatory')
  ctx.assert(body.providers, 422, 'Body parameter providers is mandatory')

  try {
    const record = {
      status: 'Acknowledged',
      requestId: request.requestId
    }
    ctx.body = record;
    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 400;
  }
})

module.exports = router