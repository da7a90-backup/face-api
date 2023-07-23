import { SsdMobilenetv1Options } from '../ssdMobilenetv1/index';
import { TinyYolov2Options } from '../tinyYolov2/index';
import { detectAllFaces } from './detectFaces';
export async function allFacesSsdMobilenetv1(input, minConfidence) {
    return detectAllFaces(input, new SsdMobilenetv1Options(minConfidence ? { minConfidence } : {}))
        .withFaceLandmarks()
        .withFaceDescriptors();
}
export async function allFacesTinyYolov2(input, forwardParams = {}) {
    return detectAllFaces(input, new TinyYolov2Options(forwardParams))
        .withFaceLandmarks()
        .withFaceDescriptors();
}
export const allFaces = allFacesSsdMobilenetv1;
