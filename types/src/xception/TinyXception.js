import * as tf from '../../dist/tfjs.esm';
import { depthwiseSeparableConv } from '../common/index';
import { toNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { normalize } from '../ops/index';
import { range } from '../utils/index';
import { extractParams } from './extractParams';
import { extractParamsFromWeightMap } from './extractParamsFromWeightMap';
function conv(x, params, stride) {
    return tf.add(tf.conv2d(x, params.filters, stride, 'same'), params.bias);
}
function reductionBlock(x, params, isActivateInput = true) {
    let out = isActivateInput ? tf.relu(x) : x;
    out = depthwiseSeparableConv(out, params.separable_conv0, [1, 1]);
    out = depthwiseSeparableConv(tf.relu(out), params.separable_conv1, [1, 1]);
    out = tf.maxPool(out, [3, 3], [2, 2], 'same');
    out = tf.add(out, conv(x, params.expansion_conv, [2, 2]));
    return out;
}
function mainBlock(x, params) {
    let out = depthwiseSeparableConv(tf.relu(x), params.separable_conv0, [1, 1]);
    out = depthwiseSeparableConv(tf.relu(out), params.separable_conv1, [1, 1]);
    out = depthwiseSeparableConv(tf.relu(out), params.separable_conv2, [1, 1]);
    out = tf.add(out, x);
    return out;
}
export class TinyXception extends NeuralNetwork {
    constructor(numMainBlocks) {
        super('TinyXception');
        this._numMainBlocks = numMainBlocks;
    }
    forwardInput(input) {
        const { params } = this;
        if (!params) {
            throw new Error('TinyXception - load model before inference');
        }
        return tf.tidy(() => {
            const batchTensor = tf.cast(input.toBatchTensor(112, true), 'float32');
            const meanRgb = [122.782, 117.001, 104.298];
            const normalized = normalize(batchTensor, meanRgb).div(255);
            let out = tf.relu(conv(normalized, params.entry_flow.conv_in, [2, 2]));
            out = reductionBlock(out, params.entry_flow.reduction_block_0, false);
            out = reductionBlock(out, params.entry_flow.reduction_block_1);
            range(this._numMainBlocks, 0, 1).forEach((idx) => {
                out = mainBlock(out, params.middle_flow[`main_block_${idx}`]);
            });
            out = reductionBlock(out, params.exit_flow.reduction_block);
            out = tf.relu(depthwiseSeparableConv(out, params.exit_flow.separable_conv, [1, 1]));
            return out;
        });
    }
    async forward(input) {
        return this.forwardInput(await toNetInput(input));
    }
    getDefaultModelName() {
        return 'tiny_xception_model';
    }
    extractParamsFromWeightMap(weightMap) {
        return extractParamsFromWeightMap(weightMap, this._numMainBlocks);
    }
    extractParams(weights) {
        return extractParams(weights, this._numMainBlocks);
    }
}
