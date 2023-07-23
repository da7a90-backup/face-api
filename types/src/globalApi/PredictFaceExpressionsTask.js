import { extendWithFaceExpressions } from '../factories/WithFaceExpressions';
import { ComposableTask } from './ComposableTask';
import { ComputeAllFaceDescriptorsTask, ComputeSingleFaceDescriptorTask } from './ComputeFaceDescriptorsTasks';
import { extractAllFacesAndComputeResults, extractSingleFaceAndComputeResult } from './extractFacesAndComputeResults';
import { nets } from './nets';
import { PredictAllAgeAndGenderTask, PredictAllAgeAndGenderWithFaceAlignmentTask, PredictSingleAgeAndGenderTask, PredictSingleAgeAndGenderWithFaceAlignmentTask } from './PredictAgeAndGenderTask';
export class PredictFaceExpressionsTaskBase extends ComposableTask {
    constructor(
    // eslint-disable-next-line no-unused-vars
    parentTask, 
    // eslint-disable-next-line no-unused-vars
    input, 
    // eslint-disable-next-line no-unused-vars
    extractedFaces) {
        super();
        this.parentTask = parentTask;
        this.input = input;
        this.extractedFaces = extractedFaces;
    }
}
export class PredictAllFaceExpressionsTask extends PredictFaceExpressionsTaskBase {
    async run() {
        const parentResults = await this.parentTask;
        const faceExpressionsByFace = await extractAllFacesAndComputeResults(parentResults, this.input, async (faces) => Promise.all(faces.map((face) => nets.faceExpressionNet.predictExpressions(face))), this.extractedFaces);
        return parentResults.map((parentResult, i) => extendWithFaceExpressions(parentResult, faceExpressionsByFace[i]));
    }
    withAgeAndGender() {
        return new PredictAllAgeAndGenderTask(this, this.input);
    }
}
export class PredictSingleFaceExpressionsTask extends PredictFaceExpressionsTaskBase {
    async run() {
        const parentResult = await this.parentTask;
        if (!parentResult) {
            return undefined;
        }
        const faceExpressions = await extractSingleFaceAndComputeResult(parentResult, this.input, (face) => nets.faceExpressionNet.predictExpressions(face), this.extractedFaces);
        return extendWithFaceExpressions(parentResult, faceExpressions);
    }
    withAgeAndGender() {
        return new PredictSingleAgeAndGenderTask(this, this.input);
    }
}
export class PredictAllFaceExpressionsWithFaceAlignmentTask extends PredictAllFaceExpressionsTask {
    withAgeAndGender() {
        return new PredictAllAgeAndGenderWithFaceAlignmentTask(this, this.input);
    }
    withFaceDescriptors() {
        return new ComputeAllFaceDescriptorsTask(this, this.input);
    }
}
export class PredictSingleFaceExpressionsWithFaceAlignmentTask extends PredictSingleFaceExpressionsTask {
    withAgeAndGender() {
        return new PredictSingleAgeAndGenderWithFaceAlignmentTask(this, this.input);
    }
    withFaceDescriptor() {
        return new ComputeSingleFaceDescriptorTask(this, this.input);
    }
}
