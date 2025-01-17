import axios from 'axios';
import loadTf from 'tfjs-node-lambda';
import { Readable } from 'stream';

const downloadFile = async (url: string) => {
  const req = await axios.get(
    url,
    { responseType: 'arraybuffer' },
  );
  return req.data;
};

const file = await downloadFile('https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br');

const readStream = Readable.from(file);

const tf: typeof import('@tensorflow/tfjs') = await loadTf(readStream);

export { tf };
export { version } from '../../dist/tfjs.version.js';
