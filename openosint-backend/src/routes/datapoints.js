const express = require('express')
const path = require('path')
const router = express.Router()

const fs = require('fs')

const datapointModel = require('../models/Datapoint')

const multer = require('multer')

const storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const multerUpload = multer({ storage: storage });

const asyncWrapper = fn => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
};

router.post('/upload', multerUpload.single('file'), asyncWrapper(async (req, res, next) => {
    const datapoint = req.body
    datapoint.filename = (Date.now() + '-' + Math.round(Math.random() * 1E9)) + path.extname(req.file.originalname)

    datapointModel.create(datapoint)
        .then((createdDatapoint) => {
            const filePath = path.join(__dirname, '../../uploads', datapoint.filename)

            // ENSURE THAT THE FILE IS AN IMAGE (WIP)



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
}))


router.get('/get', (req, res) => {
    res.send('List of all datapoints')
})

router.get('/get/:id', (req, res) => {
    const id = req.params.id
    res.send(`Datapoint with ID: ${id}`)
})

module.exports = router
