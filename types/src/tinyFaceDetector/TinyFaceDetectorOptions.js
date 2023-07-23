import { TinyYolov2Options } from '../tinyYolov2/index';
export class TinyFaceDetectorOptions extends TinyYolov2Options {
    constructor() {
        super(...arguments);
        this._name = 'TinyFaceDetectorOptions';
    }
}
