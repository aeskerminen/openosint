const multer = require('multer');
const express = require('express')
const cors = require('cors')
const datapointsRouter = require('./routes/datapoints')

const config = require('./config')

const app = express()

app.use(express.json())

app.use(cors({
  allowOrigin: '*', // Allow all origins
}))

app.use('/datapoints', datapointsRouter)



app.get('/', (req, res) => {
  res.send('Backend root')
})

app.listen(config.PORT, () => {
  console.log(`Example app listening on port ${config.PORT}`)
})
