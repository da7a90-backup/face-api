import * as tf from '../../dist/tfjs.esm';
import { convLayer } from '../common/index';
export function boxPredictionLayer(x, params) {
    return tf.tidy(() => {
        const batchSize = x.shape[0];
        const boxPredictionEncoding = tf.reshape(convLayer(x, params.box_encoding_predictor), [batchSize, -1, 1, 4]);
        const classPrediction = tf.reshape(convLayer(x, params.class_predictor), [batchSize, -1, 3]);
        return { boxPredictionEncoding, classPrediction };
    });
}
