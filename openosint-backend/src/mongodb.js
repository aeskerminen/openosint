import mongoose from 'mongoose';
import config from './config.js';

mongoose.connect(config.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB')
}).catch(err => {
    console.error('MongoDB connection error:', err)
})

const db = mongoose.connection;
export default db;