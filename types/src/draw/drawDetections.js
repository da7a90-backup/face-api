import { Box } from '../classes/index';
import { FaceDetection } from '../classes/FaceDetection';
import { isWithFaceDetection } from '../factories/WithFaceDetection';
import { round } from '../utils/index';
import { DrawBox } from './DrawBox';
export function drawDetections(canvasArg, detections) {
    const detectionsArray = Array.isArray(detections) ? detections : [detections];
    detectionsArray.forEach((det) => {
        // eslint-disable-next-line no-nested-ternary
        const score = det instanceof FaceDetection
            ? det.score
            : (isWithFaceDetection(det) ? det.detection.score : undefined);
        // eslint-disable-next-line no-nested-ternary
        const box = det instanceof FaceDetection
            ? det.box
            : (isWithFaceDetection(det) ? det.detection.box : new Box(det));
        const label = score ? `${round(score)}` : undefined;
        new DrawBox(box, { label }).draw(canvasArg);
    });
}
