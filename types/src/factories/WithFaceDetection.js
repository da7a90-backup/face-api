import { FaceDetection } from '../classes/FaceDetection';
export function isWithFaceDetection(obj) {
    return obj.detection instanceof FaceDetection;
}
export function extendWithFaceDetection(sourceObj, detection) {
    const extension = { detection };
    return { ...sourceObj, ...extension };
}
