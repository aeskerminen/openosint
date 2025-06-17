const express = require('express')
const router = express.Router()

const datapointModel = require('../models/Datapoint')

router.post('/', (req, res) => {
    const datapoint = req.body

    datapointModel.create(datapoint)
        .then((createdDatapoint) => {
            res.status(201).send(`Datapoint created with ID: ${createdDatapoint._id}`).end()
        })
        .catch((err) => {
            console.error('Error creating datapoint:', err)
            res.status(500).send('Error creating datapoint').end()
        })
})

router.get('/', (req, res) => {
    res.send('List of all datapoints')
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    res.send(`Datapoint with ID: ${id}`)
})

module.exports = router
