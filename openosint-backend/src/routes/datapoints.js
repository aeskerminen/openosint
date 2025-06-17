const express = require('express')
const router = express.Router()

const db = require('../mongodb') 

router.post('/', (req, res) => {
    const datapoint = req.body


    res.status(201).send(`Datapoint created with ID: ${datapoint.id}`)
})

router.get('/', (req, res) => {
    res.send('List of all datapoints')
})

router.get('/:id', (req, res) => {
    const id = req.params.id
    res.send(`Datapoint with ID: ${id}`)
})

module.exports = router
