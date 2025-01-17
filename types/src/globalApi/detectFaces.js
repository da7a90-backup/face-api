import { SsdMobilenetv1Options } from '../ssdMobilenetv1/SsdMobilenetv1Options';
import { DetectAllFacesTask, DetectSingleFaceTask } from './DetectFacesTasks';
export function detectSingleFace(input, options = new SsdMobilenetv1Options()) {
    return new DetectSingleFaceTask(input, options);
}
export function detectAllFaces(input, options = new SsdMobilenetv1Options()) {
    return new DetectAllFacesTask(input, options);
}
