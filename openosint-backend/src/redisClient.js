import Redis from 'ioredis';
import config from './config.js';

const redisPub = new Redis(config.REDIS_PORT);
const redisSub = new Redis(config.REDIS_PORT);

export default { redisPub, redisSub }