import Koa from "koa"
import bodyParser from "koa-bodyparser"
import logger from "koa-bodyparser"
import mainRoute from "./route/root"

const app = new Koa()
const port = 3100

app.use(bodyParser())
app.use(logger())
app.use(mainRoute.routes())

app.listen(port, async () => {
  console.log(`start listening on ${port}`)
})