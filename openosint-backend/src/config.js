import { fileURLToPath } from 'url';
import { dirname } from 'path';

const BACKEND_PORT = 3003;
const REDIS_PORT = 3004;
const MONGO_URI = 'mongodb://localhost:27017/openosint';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {BACKEND_PORT, REDIS_PORT, MONGO_URI, __dirname}


export default config