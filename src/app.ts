import express from 'express'
import { connect } from './utils/connect'
import { routes } from './routes'
import { deserializeUser } from './middleware/deserializeUser'

const app = express()
const port = 3000

//middleware
app.use(express.json())

//middleware to console every request
// app.use((req, res, next) => {
//     console.log(req.method, req.body)
//     next()
// })
app.use(deserializeUser)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, async () => {
  console.log(`app listening at port ${port}`)
  await connect()
  routes(app)
})
