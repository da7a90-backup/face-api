import * as tf from '../../dist/tfjs.esm';
export function scale(x, params) {
    return tf.add(tf.mul(x, params.weights), params.biases);
}
