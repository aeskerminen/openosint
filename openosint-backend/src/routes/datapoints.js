import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import multer from 'multer';
import datapointModel from '../models/Datapoint.js';

const router = express.Router();

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
});

const multerUpload = multer({ storage: storage });

router.post('/upload', multerUpload.single('file'), async (req, res) => {
    const datapoint = req.body
    datapoint.filename = (Date.now() + '-' + Math.round(Math.random() * 1E9)) + path.extname(req.file.originalname)
    
    const type = await fileType.fromBuffer(req.file.buffer)
    if (!type || !type.mime.startsWith('image/')) {
        return res.status(400).send('File must be an image').end()
    }

    datapointModel.create(datapoint)
        .then((createdDatapoint) => {
            const filePath = path.join(__dirname, '../../uploads', datapoint.filename)

            fs.writeFile(filePath, req.file.buffer, (err) => {
                if (err) {
                    console.error('Error saving file:', err)
                    return res.status(500).send('Error saving file').end()
                } else {
                    res.status(201).send(`Datapoint created with ID: ${createdDatapoint._id}`).end()
                }
            })

        })
        .catch((err) => {
            console.error('Error creating datapoint:', err)
            res.status(500).send('Error creating datapoint').end()
        })
})


router.get('/get', (req, res) => {
    res.send('List of all datapoints')
})

router.get('/get/:id', (req, res) => {
    const id = req.params.id
    res.send(`Datapoint with ID: ${id}`)
})

export default router;
