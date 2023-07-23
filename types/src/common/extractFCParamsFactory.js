import * as tf from '../../dist/tfjs.esm';
export function extractFCParamsFactory(extractWeights, paramMappings) {
    return (channelsIn, channelsOut, mappedPrefix) => {
        const fc_weights = tf.tensor2d(extractWeights(channelsIn * channelsOut), [channelsIn, channelsOut]);
        const fc_bias = tf.tensor1d(extractWeights(channelsOut));
        paramMappings.push({ paramPath: `${mappedPrefix}/weights` }, { paramPath: `${mappedPrefix}/bias` });
        return {
            weights: fc_weights,
            bias: fc_bias,
        };
    };
}
