import * as tf from '../../dist/tfjs.esm';
function getCenterCoordinatesAndSizesLayer(x) {
    const vec = tf.unstack(tf.transpose(x, [1, 0]));
    const sizes = [
        tf.sub(vec[2], vec[0]),
        tf.sub(vec[3], vec[1]),
    ];
    const centers = [
        tf.add(vec[0], tf.div(sizes[0], 2)),
        tf.add(vec[1], tf.div(sizes[1], 2)),
    ];
    return { sizes, centers };
}
function decodeBoxesLayer(x0, x1) {
    const { sizes, centers } = getCenterCoordinatesAndSizesLayer(x0);
    const vec = tf.unstack(tf.transpose(x1, [1, 0]));
    const div0_out = tf.div(tf.mul(tf.exp(tf.div(vec[2], 5)), sizes[0]), 2);
    const add0_out = tf.add(tf.mul(tf.div(vec[0], 10), sizes[0]), centers[0]);
    const div1_out = tf.div(tf.mul(tf.exp(tf.div(vec[3], 5)), sizes[1]), 2);
    const add1_out = tf.add(tf.mul(tf.div(vec[1], 10), sizes[1]), centers[1]);
    return tf.transpose(tf.stack([
        tf.sub(add0_out, div0_out),
        tf.sub(add1_out, div1_out),
        tf.add(add0_out, div0_out),
        tf.add(add1_out, div1_out),
    ]), [1, 0]);
}
export function outputLayer(boxPredictions, classPredictions, params) {
    return tf.tidy(() => {
        const batchSize = boxPredictions.shape[0];
        let boxes = decodeBoxesLayer(tf.reshape(tf.tile(params.extra_dim, [batchSize, 1, 1]), [-1, 4]), tf.reshape(boxPredictions, [-1, 4]));
        boxes = tf.reshape(boxes, [batchSize, (boxes.shape[0] / batchSize), 4]);
        const scoresAndClasses = tf.sigmoid(tf.slice(classPredictions, [0, 0, 1], [-1, -1, -1]));
        let scores = tf.slice(scoresAndClasses, [0, 0, 0], [-1, -1, 1]);
        scores = tf.reshape(scores, [batchSize, scores.shape[1]]);
        const boxesByBatch = tf.unstack(boxes);
        const scoresByBatch = tf.unstack(scores);
        return { boxes: boxesByBatch, scores: scoresByBatch };
    });
}
