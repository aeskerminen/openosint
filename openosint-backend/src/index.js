import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import datapointsRouter from './routes/datapoints.js';
import config from './config.js';

const app = express()

app.use(express.json())

app.use(morgan('dev'))

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
