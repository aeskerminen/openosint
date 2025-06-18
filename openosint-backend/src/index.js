import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createServer } from 'http';
import datapointsRouter from './routes/datapoints.js';
import config from './config.js';
import { createClient } from 'redis';
import { Server } from 'socket.io';


const app = express();
const httpServer = createServer(app);

const socketIOserver = new Server(httpServer, { cors: { origin: '*' } });
const redisSub = createClient({ socket: { host: 'localhost', port: config.REDIS_PORT } });

app.use(express.json())
app.use(morgan('dev'))

app.use(cors({
  origin: '*',
}))


socketIOserver.on('connection', (socket) => {
  console.log('Frontend connected to Socket.IO server');

  socket.on('subscribe', (jobID) => {
    socket.join(jobID);
    console.log(`Frontend subscribed to job ID: ${jobID}`);
  })
});

(async () => {
  await redisSub.connect();
  await redisSub.subscribe('ml:results', (message) => {
    console.log(`Job ID: ${message} is done, notifying frontend...`);
    socketIOserver.to(message).emit('done', { jobID: message });
  });
})();

app.use('/datapoints', datapointsRouter)

httpServer.listen(config.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${config.BACKEND_PORT}`)
})