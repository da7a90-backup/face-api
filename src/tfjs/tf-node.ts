import loadTf from 'tfjs-node-lambda';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

const downloadFile = async (url: string) => {
  const req = await fetch(url);
  const data = await req.arrayBuffer();
  return data;
};

const file = await downloadFile('https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br');

const readStream = Readable.from(Buffer.from(file));

const tf: typeof import('@tensorflow/tfjs') = await loadTf(readStream);

export default tf;
export { version } from '../../dist/tfjs.version.js';
