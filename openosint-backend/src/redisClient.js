import Redis from 'ioredis';
import config from './config.js';

const redis = new Redis(config.REDIS_PORT);

export default redis