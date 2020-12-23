import * as tf from '../../dist/tfjs.esm.js';
import { IDimensions } from '../classes/index';
import { FaceLandmarks68 } from '../classes/FaceLandmarks68';
import { NetInput, TNetInput } from '../dom/index';
import { FaceFeatureExtractorParams, TinyFaceFeatureExtractorParams } from '../faceFeatureExtractor/types';
import { FaceProcessor } from '../faceProcessor/FaceProcessor';
export declare abstract class FaceLandmark68NetBase<TExtractorParams extends FaceFeatureExtractorParams | TinyFaceFeatureExtractorParams> extends FaceProcessor<TExtractorParams> {
    postProcess(output: tf.Tensor2D, inputSize: number, originalDimensions: IDimensions[]): tf.Tensor2D;
    forwardInput(input: NetInput): tf.Tensor2D;
    forward(input: TNetInput): Promise<tf.Tensor2D>;
    detectLandmarks(input: TNetInput): Promise<FaceLandmarks68 | FaceLandmarks68[]>;
    protected getClassifierChannelsOut(): number;
}
