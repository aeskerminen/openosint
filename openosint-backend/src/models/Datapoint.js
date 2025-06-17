const db = require('../mongodb')
const mongoose = require('mongoose')

const datapointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },

}, { timestamps: true })

const datapointModel = mongoose.model('Datapoint', datapointSchema)
module.exports = datapointModel