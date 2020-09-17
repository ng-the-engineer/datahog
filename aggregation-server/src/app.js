import Koa from "koa"
import bodyParser from "koa-bodyparser"
import logger from "koa-bodyparser"
import mainRoute from "./route/root"

const app = new Koa()

app.use(bodyParser())
app.use(logger())
app.use(mainRoute.routes())

app.listen(3200, async () => {
  console.log('start listening on 3200')
})