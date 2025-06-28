import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import imageDatapointsRouter from "./routes/imageDatapoints.js";
import textDatapointsRouter from "./routes/textDatapoints.js";
import config from "./config.js";
import { Server } from "socket.io";
import redis from "./redisClient.js";
import path from "path";
import { urlencoded } from "express";

const app = express();
const httpServer = createServer(app);

const socketIOserver = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  "/api/images",
  express.static(path.join(config.__dirname, "../../data/output"))
);

app.use("/api/textDatapoints", textDatapointsRouter);
app.use("/api/imageDatapoints", imageDatapointsRouter);

socketIOserver.on("connection", (socket) => {
  console.log("Frontend connected to Socket.IO server");

  socket.on("subscribe", (jobID) => {
    socket.join(jobID);
    console.log(`Frontend subscribed to job ID: ${jobID}`);
  });
});

(async () => {
  redis.redisSub.on("message", (channel, message) => {
    console.log(`Received message from channel ${channel}: ${message}`);
    socketIOserver.to(message).emit("done", { jobID: message });
  });

  await redis.redisSub.subscribe("ml:results");
  console.log("Subscribed to ml:results channel");
})();

httpServer.listen(config.BACKEND_PORT, () => {
  console.log(`Example app listening on port ${config.BACKEND_PORT}`);
});
