import db from '../mongodb.js';
import mongoose from 'mongoose';

const datapointSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    eventTime: {
        type: Date,
        default: Date.now
    },
    
},{timestamps: true, _id: true})

const datapointModel = mongoose.model('Datapoint', datapointSchema);
export default datapointModel;