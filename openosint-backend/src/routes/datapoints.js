import express from "express";
import path from "path";
import fs, { stat } from "fs";
import { fileTypeFromBuffer } from "file-type";
import multer from "multer";
import datapointModel from "../models/Datapoint.js";

import config from "../config.js";
import redis from "../redisClient.js";

import { v4 as uuidv4 } from "uuid";

const router = express.Router();
const storage = multer.memoryStorage();

const multerUpload = multer({ storage: storage });

const uploadDir = "/data/uploads";
const outputDir = "/data/output";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

router.post("/upload", multerUpload.single("file"), async (req, res) => {
  const datapoint = req.body;
  datapoint.filename =
    Date.now() +
    "-" +
    Math.round(Math.random() * 1e9) +
    path.extname(req.file.originalname);

  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || !type.mime.startsWith("image/")) {
    return res.status(400).send("File must be an image").end();
  }

  datapointModel
    .create(datapoint)
    .then((createdDatapoint) => {
      const filePath = path.join(uploadDir, datapoint.filename);

      fs.writeFile(filePath, req.file.buffer, async (err) => {
        if (err) {
          console.error("Error saving file:", err);
          return res.status(500).send("Error saving file").end();
        } else {
          const jobID = uuidv4();
          const inputPath = filePath;

          const jobData = JSON.stringify({
            jobID: jobID,
            inputPath: inputPath,
            datapoint: {
              _id: createdDatapoint._id.toString(),
              name: createdDatapoint.name,
              filename: createdDatapoint.filename,
              createdAt: createdDatapoint.createdAt,
              updatedAt: createdDatapoint.updatedAt,
            },
          });

          await redis.redisPub.rpush("ml:jobs", jobData);
          await redis.redisPub.set(`status:${jobID}`, "queued");

          res.status(201).json({ jobID }).end();
        }
      });
    })
    .catch((err) => {
      console.error("Error creating datapoint:", err);
      res.status(500).send("Error creating datapoint").end();
    });
});

router.get("/:amount&:offset", (req, res) => {
  const amount = parseInt(req.params.amount, 10) || 10;
  const offset = parseInt(req.params.offset, 10) || 0;

  datapointModel
    .find({})
    .skip(offset)
    .limit(amount)
    .then((datapoints) => {
      res.status(200).json(datapoints).end();
    })
    .catch((err) => {
      console.error("Error fetching datapoints:", err);
      res.status(500).send("Error fetching datapoints").end();
    });
});

router.get("/", (req, res) => {
  datapointModel
    .find({})
    .then((datapoints) => {
      res.status(200).json(datapoints).end();
    })
    .catch((err) => {
      console.error("Error fetching datapoints:", err);
      res.status(500).send("Error fetching datapoints").end();
    });
});

router.delete("/:id", async (req, res) => {
  try {
    const datapoint = await datapointModel.findByIdAndDelete(req.params.id);
    if (!datapoint) {
      return res.status(404).json({ error: "Datapoint not found" });
    }
    // Optionally, delete the associated image file
    const filePath = path.join(outputDir, datapoint.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(200).json({ message: "Datapoint deleted" });
  } catch (err) {
    console.error("Error deleting datapoint:", err);
    res.status(500).json({ error: "Error deleting datapoint" });
  }
});

export default router;
