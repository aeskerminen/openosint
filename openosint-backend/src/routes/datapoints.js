import express from 'express';
import path from 'path';
import fs, { stat } from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import multer from 'multer';
import datapointModel from '../models/Datapoint.js';

import config from '../config.js';
import redis from '../redisClient.js';

import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const storage = multer.memoryStorage();

const multerUpload = multer({ storage: storage });

const uploadDir = path.join(config.__dirname, '../uploads');
const outputDir = path.join(config.__dirname, '../output');

router.post('/upload', multerUpload.single('file'), async (req, res) => {
    const datapoint = req.body
    datapoint.filename = (Date.now() + '-' + Math.round(Math.random() * 1E9)) + path.extname(req.file.originalname)

    const type = await fileTypeFromBuffer(req.file.buffer)
    if (!type || !type.mime.startsWith('image/')) {
        return res.status(400).send('File must be an image').end()
    }

    datapointModel.create(datapoint)
        .then((createdDatapoint) => {
            const filePath = path.join(uploadDir, datapoint.filename)

            fs.writeFile(filePath, req.file.buffer, async (err) => {
                if (err) {
                    console.error('Error saving file:', err)
                    return res.status(500).send('Error saving file').end()
                } else {

                    const jobID = uuidv4()
                    const inputPath = filePath
                    const outputPath = outputDir + '/' + jobID + '.json'

                    const jobData = JSON.stringify({
                        jobID: jobID,
                        inputPath: inputPath,
                        outputPath: outputPath,
                    })

                    await redis.rpush('ml:jobs', jobData)
                    await redis.set(`status:${jobID}`, 'queued')

                    res.status(201).json({jobID}).end()
                }
            })

        })
        .catch((err) => {
            console.error('Error creating datapoint:', err)
            res.status(500).send('Error creating datapoint').end()
        })
})

export default router;
