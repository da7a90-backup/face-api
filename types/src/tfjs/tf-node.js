import axios from 'axios';
const downloadFile = async (url) => {
    const req = await axios.get(url, { responseType: 'arraybuffer' });
    return req.data;
};
import loadTf from 'tfjs-node-lambda';
import { Readable } from 'stream';
const file = await downloadFile('https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br');
const readStream = Readable.from(file);
const tf = await loadTf(readStream);
export default tf;
export { version } from '../../dist/tfjs.version.js';
