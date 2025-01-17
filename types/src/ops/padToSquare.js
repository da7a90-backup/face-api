import * as tf from '../../dist/tfjs.esm';
/**
 * Pads the smaller dimension of an image tensor with zeros, such that width === height.
 *
 * @param imgTensor The image tensor.
 * @param isCenterImage (optional, default: false) If true, add an equal amount of padding on
 * both sides of the minor dimension oof the image.
 * @returns The padded tensor with width === height.
 */
export function padToSquare(imgTensor, isCenterImage = false) {
    return tf.tidy(() => {
        const [height, width] = imgTensor.shape.slice(1);
        if (height === width)
            return imgTensor;
        const dimDiff = Math.abs(height - width);
        const paddingAmount = Math.round(dimDiff * (isCenterImage ? 0.5 : 1));
        const paddingAxis = height > width ? 2 : 1;
        const createPaddingTensor = (paddingAmountLocal) => {
            const paddingTensorShape = imgTensor.shape.slice();
            paddingTensorShape[paddingAxis] = paddingAmountLocal;
            return tf.fill(paddingTensorShape, 0, 'float32');
        };
        const paddingTensorAppend = createPaddingTensor(paddingAmount);
        const remainingPaddingAmount = dimDiff - paddingTensorAppend.shape[paddingAxis];
        const paddingTensorPrepend = isCenterImage && remainingPaddingAmount ? createPaddingTensor(remainingPaddingAmount) : null;
        const tensorsToStack = [paddingTensorPrepend, imgTensor, paddingTensorAppend]
            .filter((t) => !!t)
            .map((t) => tf.cast(t, 'float32'));
        return tf.concat(tensorsToStack, paddingAxis);
    });
}
