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
    
},{timestamps: true, _id: true})

const datapointModel = mongoose.model('Datapoint', datapointSchema);
export default datapointModel;