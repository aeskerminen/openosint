import Redis from 'ioredis';
import { config } from 'process';

const redis = new Redis(config.REDIS_PORT);

export default redis