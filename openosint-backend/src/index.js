const express = require('express')
const datapointsRouter = require('./routes/datapoints')

const app = express()
const port = 3000

app.use(express.json())

app.use('/datapoints', datapointsRouter)

app.get('/', (req, res) => {
  res.send('Backend root')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})