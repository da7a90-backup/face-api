export class TinyYolov2Options {
    constructor({ inputSize, scoreThreshold } = {}) {
        this._name = 'TinyYolov2Options';
        this._inputSize = inputSize || 416;
        this._scoreThreshold = scoreThreshold || 0.5;
        if (typeof this._inputSize !== 'number' || this._inputSize % 32 !== 0) {
            throw new Error(`${this._name} - expected inputSize to be a number divisible by 32`);
        }
        if (typeof this._scoreThreshold !== 'number' || this._scoreThreshold <= 0 || this._scoreThreshold >= 1) {
            throw new Error(`${this._name} - expected scoreThreshold to be a number between 0 and 1`);
        }
    }
    get inputSize() { return this._inputSize; }
    get scoreThreshold() { return this._scoreThreshold; }
}
