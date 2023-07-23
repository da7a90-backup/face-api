import * as tf from '../../dist/tfjs.esm';
export function extractConvParamsFactory(extractWeights, paramMappings) {
    return (channelsIn, channelsOut, filterSize, mappedPrefix) => {
        const filters = tf.tensor4d(extractWeights(channelsIn * channelsOut * filterSize * filterSize), [filterSize, filterSize, channelsIn, channelsOut]);
        const bias = tf.tensor1d(extractWeights(channelsOut));
        paramMappings.push({ paramPath: `${mappedPrefix}/filters` }, { paramPath: `${mappedPrefix}/bias` });
        return { filters, bias };
    };
}
