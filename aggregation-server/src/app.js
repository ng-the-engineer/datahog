import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import mainRoute from './route/root'
import config from './config'

const app = new Koa()

const port = config.port || 3200

app.use(bodyParser())
app.use(logger())
app.use(mainRoute.routes())

app.listen(port, async () => {
  console.log(`Aggregation Server starts listening on port ${port}`)
})
