import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = 3003;
const MONGO_URI = 'mongodb://localhost:27017/openosint';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {PORT, MONGO_URI, __dirname}


export default config