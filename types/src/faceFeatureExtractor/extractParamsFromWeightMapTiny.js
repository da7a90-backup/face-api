import { disposeUnusedWeightTensors } from '../common/index';
import { loadParamsFactory } from './loadParamsFactory';
export function extractParamsFromWeightMapTiny(weightMap) {
    const paramMappings = [];
    const { extractDenseBlock3Params, } = loadParamsFactory(weightMap, paramMappings);
    const params = {
        dense0: extractDenseBlock3Params('dense0', true),
        dense1: extractDenseBlock3Params('dense1'),
        dense2: extractDenseBlock3Params('dense2'),
    };
    disposeUnusedWeightTensors(weightMap, paramMappings);
    return { params, paramMappings };
}
