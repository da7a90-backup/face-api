/* eslint-disable max-classes-per-file */
import * as tf from '../../dist/tfjs.esm';
import { extractFaces, extractFaceTensors } from '../dom/index';
import { extendWithFaceLandmarks } from '../factories/WithFaceLandmarks';
import { ComposableTask } from './ComposableTask';
import { ComputeAllFaceDescriptorsTask, ComputeSingleFaceDescriptorTask } from './ComputeFaceDescriptorsTasks';
import { nets } from './nets';
import { PredictAllAgeAndGenderWithFaceAlignmentTask, PredictSingleAgeAndGenderWithFaceAlignmentTask } from './PredictAgeAndGenderTask';
import { PredictAllFaceExpressionsWithFaceAlignmentTask, PredictSingleFaceExpressionsWithFaceAlignmentTask } from './PredictFaceExpressionsTask';
export class DetectFaceLandmarksTaskBase extends ComposableTask {
    constructor(
    // eslint-disable-next-line no-unused-vars
    parentTask, 
    // eslint-disable-next-line no-unused-vars
    input, 
    // eslint-disable-next-line no-unused-vars
    useTinyLandmarkNet) {
        super();
        this.parentTask = parentTask;
        this.input = input;
        this.useTinyLandmarkNet = useTinyLandmarkNet;
    }
    get landmarkNet() {
        return this.useTinyLandmarkNet
            ? nets.faceLandmark68TinyNet
            : nets.faceLandmark68Net;
    }
}
export class DetectAllFaceLandmarksTask extends DetectFaceLandmarksTaskBase {
    async run() {
        const parentResults = await this.parentTask;
        const detections = parentResults.map((res) => res.detection);
        const faces = this.input instanceof tf.Tensor
            ? await extractFaceTensors(this.input, detections)
            : await extractFaces(this.input, detections);
        const faceLandmarksByFace = await Promise.all(faces.map((face) => this.landmarkNet.detectLandmarks(face)));
        faces.forEach((f) => f instanceof tf.Tensor && f.dispose());
        const result = parentResults
            .filter((_parentResult, i) => faceLandmarksByFace[i])
            .map((parentResult, i) => extendWithFaceLandmarks(parentResult, faceLandmarksByFace[i]));
        return result;
    }
    withFaceExpressions() {
        return new PredictAllFaceExpressionsWithFaceAlignmentTask(this, this.input);
    }
    withAgeAndGender() {
        return new PredictAllAgeAndGenderWithFaceAlignmentTask(this, this.input);
    }
    withFaceDescriptors() {
        return new ComputeAllFaceDescriptorsTask(this, this.input);
    }
}
export class DetectSingleFaceLandmarksTask extends DetectFaceLandmarksTaskBase {
    async run() {
        const parentResult = await this.parentTask;
        if (!parentResult) {
            return undefined;
        }
        const { detection } = parentResult;
        const faces = this.input instanceof tf.Tensor
            ? await extractFaceTensors(this.input, [detection])
            : await extractFaces(this.input, [detection]);
        const landmarks = await this.landmarkNet.detectLandmarks(faces[0]);
        faces.forEach((f) => f instanceof tf.Tensor && f.dispose());
        return extendWithFaceLandmarks(parentResult, landmarks);
    }
    withFaceExpressions() {
        return new PredictSingleFaceExpressionsWithFaceAlignmentTask(this, this.input);
    }
    withAgeAndGender() {
        return new PredictSingleAgeAndGenderWithFaceAlignmentTask(this, this.input);
    }
    withFaceDescriptor() {
        return new ComputeSingleFaceDescriptorTask(this, this.input);
    }
}
