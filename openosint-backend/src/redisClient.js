import Redis from 'ioredis';
import config from './config.js';

const redisPub = new Redis(config.REDIS_PORT, 'redis');
const redisSub = new Redis(config.REDIS_PORT, 'redis');

export default { redisPub, redisSub }