import { isTensor } from '../utils/index';
export function extractWeightEntryFactory(weightMap, paramMappings) {
    return (originalPath, paramRank, mappedPath) => {
        const tensor = weightMap[originalPath];
        if (!isTensor(tensor, paramRank)) {
            throw new Error(`expected weightMap[${originalPath}] to be a Tensor${paramRank}D, instead have ${tensor}`);
        }
        paramMappings.push({ originalPath, paramPath: mappedPath || originalPath });
        return tensor;
    };
}
