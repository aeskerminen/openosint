const db = require('../mongodb')
const mongoose = require('mongoose')

const datapointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
})

const datapointModel = mongoose.model('Datapoint', datapointSchema)
module.exports = datapointModel