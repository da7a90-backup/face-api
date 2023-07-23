import * as tf from '../../dist/tfjs.esm';
export function leaky(x) {
    return tf.tidy(() => {
        const min = tf.mul(x, tf.scalar(0.10000000149011612));
        return tf.add(tf.relu(tf.sub(x, min)), min);
    });
}
