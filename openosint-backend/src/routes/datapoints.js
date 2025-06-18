const express = require('express')
const path = require('path')
const router = express.Router()

const datapointModel = require('../models/Datapoint')

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const multerUpload = multer({ storage: multer.memoryStorage });

router.post('/upload', multerUpload.single('file'), (req, res) => {
    const datapoint = req.body
    datapoint.filename = req.file.filename

    datapointModel.create(datapoint)
        .then((createdDatapoint) => {
            const filePath = path.join(__dirname, '../../uploads', req.file.filename)
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

module.exports = router
