import * as tf from '../../dist/tfjs.esm.js';
import { NetInput, TNetInput } from '../dom/index';
import { NeuralNetwork } from '../NeuralNetwork';
import { NetParams } from './types';
export declare class FaceRecognitionNet extends NeuralNetwork<NetParams> {
    constructor();
    forwardInput(input: NetInput): tf.Tensor2D;
    forward(input: TNetInput): Promise<tf.Tensor2D>;
    computeFaceDescriptor(input: TNetInput): Promise<Float32Array | Float32Array[]>;
    protected getDefaultModelName(): string;
    protected extractParamsFromWeigthMap(weightMap: tf.NamedTensorMap): {
        params: NetParams;
        paramMappings: import("../common/types.js").ParamMapping[];
    };
    protected extractParams(weights: Float32Array): {
        params: NetParams;
        paramMappings: import("../common/types.js").ParamMapping[];
    };
}
