import * as tf from '../../dist/tfjs.esm';
import { toNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { normalize } from '../ops/index';
import { denseBlock3 } from './denseBlock';
import { extractParamsFromWeightMapTiny } from './extractParamsFromWeightMapTiny';
import { extractParamsTiny } from './extractParamsTiny';
export class TinyFaceFeatureExtractor extends NeuralNetwork {
    constructor() {
        super('TinyFaceFeatureExtractor');
    }
    forwardInput(input) {
        const { params } = this;
        if (!params) {
            throw new Error('TinyFaceFeatureExtractor - load model before inference');
        }
        return tf.tidy(() => {
            const batchTensor = tf.cast(input.toBatchTensor(112, true), 'float32');
            const meanRgb = [122.782, 117.001, 104.298];
            const normalized = normalize(batchTensor, meanRgb).div(255);
            let out = denseBlock3(normalized, params.dense0, true);
            out = denseBlock3(out, params.dense1);
            out = denseBlock3(out, params.dense2);
            out = tf.avgPool(out, [14, 14], [2, 2], 'valid');
            return out;
        });
    }
    async forward(input) {
        return this.forwardInput(await toNetInput(input));
    }
    getDefaultModelName() {
        return 'face_feature_extractor_tiny_model';
    }
    extractParamsFromWeightMap(weightMap) {
        return extractParamsFromWeightMapTiny(weightMap);
    }
    extractParams(weights) {
        return extractParamsTiny(weights);
    }
}
