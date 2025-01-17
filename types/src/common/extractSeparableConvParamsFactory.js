import * as tf from '../../dist/tfjs.esm';
import { SeparableConvParams } from './types';
export function extractSeparableConvParamsFactory(extractWeights, paramMappings) {
    return (channelsIn, channelsOut, mappedPrefix) => {
        const depthwise_filter = tf.tensor4d(extractWeights(3 * 3 * channelsIn), [3, 3, channelsIn, 1]);
        const pointwise_filter = tf.tensor4d(extractWeights(channelsIn * channelsOut), [1, 1, channelsIn, channelsOut]);
        const bias = tf.tensor1d(extractWeights(channelsOut));
        paramMappings.push({ paramPath: `${mappedPrefix}/depthwise_filter` }, { paramPath: `${mappedPrefix}/pointwise_filter` }, { paramPath: `${mappedPrefix}/bias` });
        return new SeparableConvParams(depthwise_filter, pointwise_filter, bias);
    };
}
export function loadSeparableConvParamsFactory(
// eslint-disable-next-line no-unused-vars
extractWeightEntry) {
    return (prefix) => {
        const depthwise_filter = extractWeightEntry(`${prefix}/depthwise_filter`, 4);
        const pointwise_filter = extractWeightEntry(`${prefix}/pointwise_filter`, 4);
        const bias = extractWeightEntry(`${prefix}/bias`, 1);
        return new SeparableConvParams(depthwise_filter, pointwise_filter, bias);
    };
}
