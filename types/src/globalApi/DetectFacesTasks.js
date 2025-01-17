import { extendWithFaceDetection } from '../factories/WithFaceDetection';
import { SsdMobilenetv1Options } from '../ssdMobilenetv1/SsdMobilenetv1Options';
import { TinyFaceDetectorOptions } from '../tinyFaceDetector/TinyFaceDetectorOptions';
import { TinyYolov2Options } from '../tinyYolov2/index';
import { ComposableTask } from './ComposableTask';
import { DetectAllFaceLandmarksTask, DetectSingleFaceLandmarksTask } from './DetectFaceLandmarksTasks';
import { nets } from './nets';
import { PredictAllAgeAndGenderTask, PredictSingleAgeAndGenderTask } from './PredictAgeAndGenderTask';
import { PredictAllFaceExpressionsTask, PredictSingleFaceExpressionsTask } from './PredictFaceExpressionsTask';
export class DetectFacesTaskBase extends ComposableTask {
    // eslint-disable-next-line no-unused-vars
    constructor(input, options = new SsdMobilenetv1Options()) {
        super();
        this.input = input;
        this.options = options;
    }
}
export class DetectAllFacesTask extends DetectFacesTaskBase {
    async run() {
        const { input, options } = this;
        let result;
        if (options instanceof TinyFaceDetectorOptions)
            result = nets.tinyFaceDetector.locateFaces(input, options);
        else if (options instanceof SsdMobilenetv1Options)
            result = nets.ssdMobilenetv1.locateFaces(input, options);
        else if (options instanceof TinyYolov2Options)
            result = nets.tinyYolov2.locateFaces(input, options);
        else
            throw new Error('detectFaces - expected options to be instance of TinyFaceDetectorOptions | SsdMobilenetv1Options | TinyYolov2Options');
        return result;
    }
    runAndExtendWithFaceDetections() {
        return new Promise((resolve, reject) => {
            this.run()
                .then((detections) => resolve(detections.map((detection) => extendWithFaceDetection({}, detection))))
                .catch((err) => reject(err));
        });
    }
    withFaceLandmarks(useTinyLandmarkNet = false) {
        return new DetectAllFaceLandmarksTask(this.runAndExtendWithFaceDetections(), this.input, useTinyLandmarkNet);
    }
    withFaceExpressions() {
        return new PredictAllFaceExpressionsTask(this.runAndExtendWithFaceDetections(), this.input);
    }
    withAgeAndGender() {
        return new PredictAllAgeAndGenderTask(this.runAndExtendWithFaceDetections(), this.input);
    }
}
export class DetectSingleFaceTask extends DetectFacesTaskBase {
    async run() {
        const faceDetections = await new DetectAllFacesTask(this.input, this.options);
        let faceDetectionWithHighestScore = faceDetections[0];
        faceDetections.forEach((faceDetection) => {
            if (faceDetection.score > faceDetectionWithHighestScore.score)
                faceDetectionWithHighestScore = faceDetection;
        });
        return faceDetectionWithHighestScore;
    }
    runAndExtendWithFaceDetection() {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const detection = await this.run();
            resolve(detection ? extendWithFaceDetection({}, detection) : undefined);
        });
    }
    withFaceLandmarks(useTinyLandmarkNet = false) {
        return new DetectSingleFaceLandmarksTask(this.runAndExtendWithFaceDetection(), this.input, useTinyLandmarkNet);
    }
    withFaceExpressions() {
        return new PredictSingleFaceExpressionsTask(this.runAndExtendWithFaceDetection(), this.input);
    }
    withAgeAndGender() {
        return new PredictSingleAgeAndGenderTask(this.runAndExtendWithFaceDetection(), this.input);
    }
}
