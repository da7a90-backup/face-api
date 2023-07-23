import * as tf from '../../dist/tfjs.esm';
import { toNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { normalize } from '../ops/index';
import { denseBlock4 } from './denseBlock';
import { extractParams } from './extractParams';
import { extractParamsFromWeightMap } from './extractParamsFromWeightMap';
export class FaceFeatureExtractor extends NeuralNetwork {
    constructor() {
        super('FaceFeatureExtractor');
    }
    forwardInput(input) {
        const { params } = this;
        if (!params) {
            throw new Error('FaceFeatureExtractor - load model before inference');
        }
        return tf.tidy(() => {
            const batchTensor = tf.cast(input.toBatchTensor(112, true), 'float32');
            const meanRgb = [122.782, 117.001, 104.298];
            const normalized = normalize(batchTensor, meanRgb).div(255);
            let out = denseBlock4(normalized, params.dense0, true);
            out = denseBlock4(out, params.dense1);
            out = denseBlock4(out, params.dense2);
            out = denseBlock4(out, params.dense3);
            out = tf.avgPool(out, [7, 7], [2, 2], 'valid');
            return out;
        });
    }
    async forward(input) {
        return this.forwardInput(await toNetInput(input));
    }
    getDefaultModelName() {
        return 'face_feature_extractor_model';
    }
    extractParamsFromWeightMap(weightMap) {
        return extractParamsFromWeightMap(weightMap);
    }
    extractParams(weights) {
        return extractParams(weights);
    }
}
