import * as tf from '../../dist/tfjs.esm';
import { toNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { normalize } from '../ops/index';
import { convDown } from './convLayer';
import { extractParams } from './extractParams';
import { extractParamsFromWeightMap } from './extractParamsFromWeightMap';
import { residual, residualDown } from './residualLayer';
export class FaceRecognitionNet extends NeuralNetwork {
    constructor() {
        super('FaceRecognitionNet');
    }
    forwardInput(input) {
        const { params } = this;
        if (!params) {
            throw new Error('FaceRecognitionNet - load model before inference');
        }
        return tf.tidy(() => {
            const batchTensor = tf.cast(input.toBatchTensor(150, true), 'float32');
            const meanRgb = [122.782, 117.001, 104.298];
            const normalized = normalize(batchTensor, meanRgb).div(255);
            let out = convDown(normalized, params.conv32_down);
            out = tf.maxPool(out, 3, 2, 'valid');
            out = residual(out, params.conv32_1);
            out = residual(out, params.conv32_2);
            out = residual(out, params.conv32_3);
            out = residualDown(out, params.conv64_down);
            out = residual(out, params.conv64_1);
            out = residual(out, params.conv64_2);
            out = residual(out, params.conv64_3);
            out = residualDown(out, params.conv128_down);
            out = residual(out, params.conv128_1);
            out = residual(out, params.conv128_2);
            out = residualDown(out, params.conv256_down);
            out = residual(out, params.conv256_1);
            out = residual(out, params.conv256_2);
            out = residualDown(out, params.conv256_down_out);
            const globalAvg = out.mean([1, 2]);
            const fullyConnected = tf.matMul(globalAvg, params.fc);
            return fullyConnected;
        });
    }
    async forward(input) {
        return this.forwardInput(await toNetInput(input));
    }
    async computeFaceDescriptor(input) {
        // @ts-ignore
        if (input?.shape?.some((dim) => dim <= 0))
            return new Float32Array(128);
        const netInput = await toNetInput(input);
        const faceDescriptorTensors = tf.tidy(() => tf.unstack(this.forwardInput(netInput)));
        const faceDescriptorsForBatch = await Promise.all(faceDescriptorTensors.map((t) => t.data()));
        faceDescriptorTensors.forEach((t) => t.dispose());
        return netInput.isBatchInput ? faceDescriptorsForBatch : faceDescriptorsForBatch[0];
    }
    getDefaultModelName() {
        return 'face_recognition_model';
    }
    extractParamsFromWeightMap(weightMap) {
        return extractParamsFromWeightMap(weightMap);
    }
    extractParams(weights) {
        return extractParams(weights);
    }
}
