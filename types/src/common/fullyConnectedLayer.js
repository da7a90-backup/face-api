import * as tf from '../../dist/tfjs.esm';
export function fullyConnectedLayer(x, params) {
    return tf.tidy(() => tf.add(tf.matMul(x, params.weights), params.bias));
}
