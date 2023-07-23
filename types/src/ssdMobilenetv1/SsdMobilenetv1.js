import * as tf from '../../dist/tfjs.esm';
import { Rect } from '../classes/index';
import { FaceDetection } from '../classes/FaceDetection';
import { toNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { extractParams } from './extractParams';
import { extractParamsFromWeightMap } from './extractParamsFromWeightMap';
import { mobileNetV1 } from './mobileNetV1';
import { nonMaxSuppression } from './nonMaxSuppression';
import { outputLayer } from './outputLayer';
import { predictionLayer } from './predictionLayer';
import { SsdMobilenetv1Options } from './SsdMobilenetv1Options';
export class SsdMobilenetv1 extends NeuralNetwork {
    constructor() {
        super('SsdMobilenetv1');
    }
    forwardInput(input) {
        const { params } = this;
        if (!params)
            throw new Error('SsdMobilenetv1 - load model before inference');
        return tf.tidy(() => {
            const batchTensor = tf.cast(input.toBatchTensor(512, false), 'float32');
            const x = tf.sub(tf.div(batchTensor, 127.5), 1); // input is normalized -1..1
            const features = mobileNetV1(x, params.mobilenetv1);
            const { boxPredictions, classPredictions } = predictionLayer(features.out, features.conv11, params.prediction_layer);
            return outputLayer(boxPredictions, classPredictions, params.output_layer);
        });
    }
    async forward(input) {
        return this.forwardInput(await toNetInput(input));
    }
    async locateFaces(input, options = {}) {
        const { maxResults, minConfidence } = new SsdMobilenetv1Options(options);
        const netInput = await toNetInput(input);
        const { boxes: _boxes, scores: _scores } = this.forwardInput(netInput);
        const boxes = _boxes[0];
        const scores = _scores[0];
        for (let i = 1; i < _boxes.length; i++) {
            _boxes[i].dispose();
            _scores[i].dispose();
        }
        const scoresData = Array.from(scores.dataSync());
        const iouThreshold = 0.5;
        const indices = nonMaxSuppression(boxes, scoresData, maxResults, iouThreshold, minConfidence);
        const reshapedDims = netInput.getReshapedInputDimensions(0);
        const inputSize = netInput.inputSize;
        const padX = inputSize / reshapedDims.width;
        const padY = inputSize / reshapedDims.height;
        const boxesData = boxes.arraySync();
        const results = indices
            .map((idx) => {
            const [top, bottom] = [
                Math.max(0, boxesData[idx][0]),
                Math.min(1.0, boxesData[idx][2]),
            ].map((val) => val * padY);
            const [left, right] = [
                Math.max(0, boxesData[idx][1]),
                Math.min(1.0, boxesData[idx][3]),
            ].map((val) => val * padX);
            return new FaceDetection(scoresData[idx], new Rect(left, top, right - left, bottom - top), { height: netInput.getInputHeight(0), width: netInput.getInputWidth(0) });
        });
        boxes.dispose();
        scores.dispose();
        return results;
    }
    getDefaultModelName() {
        return 'ssd_mobilenetv1_model';
    }
    extractParamsFromWeightMap(weightMap) {
        return extractParamsFromWeightMap(weightMap);
    }
    extractParams(weights) {
        return extractParams(weights);
    }
}
