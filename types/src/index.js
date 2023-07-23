import axios from 'axios';
import loadTf from 'tfjs-node-lambda';
import { Readable } from 'stream';

const downloadFile = async (url) => {
  const req = await axios.get(
    url,
    { responseType: 'arraybuffer' },
  );
  return req.data;
};

const file = await downloadFile('https://github.com/jlarmstrongiv/tfjs-node-lambda/releases/download/v2.0.10/nodejs12.x-tf2.8.6.br');

const readStream = Readable.from(file);

const tf = await loadTf(readStream);
import * as draw from './draw/index';
import * as utils from './utils/index';
import * as pkg from '../package.json';
export { tf, draw, utils };
export * from './ageGenderNet/index';
export * from './classes/index';
export * from './dom/index';
export * from './env/index';
export * from './faceExpressionNet/index';
export * from './faceLandmarkNet/index';
export * from './faceRecognitionNet/index';
export * from './factories/index';
export * from './globalApi/index';
export * from './ops/index';
export * from './ssdMobilenetv1/index';
export * from './tinyFaceDetector/index';
export * from './tinyYolov2/index';
export * from './euclideanDistance';
export * from './NeuralNetwork';
export * from './resizeResults';
export const version = pkg.version;
// set webgl defaults
// if (browser) tf.ENV.set('WEBGL_USE_SHAPES_UNIFORMS', true);