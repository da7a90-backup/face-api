import * as tf from '../../dist/tfjs.esm.js';
import { SeparableConvParams } from './types';
export declare function depthwiseSeparableConv(x: tf.Tensor4D, params: SeparableConvParams, stride: [number, number]): tf.Tensor4D;
