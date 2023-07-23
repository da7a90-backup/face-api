import { isValidProbablitiy } from '../utils/index';
import { LabeledBox } from './LabeledBox';
export class PredictedBox extends LabeledBox {
    static assertIsValidPredictedBox(box, callee) {
        LabeledBox.assertIsValidLabeledBox(box, callee);
        if (!isValidProbablitiy(box.score)
            || !isValidProbablitiy(box.classScore)) {
            throw new Error(`${callee} - expected properties score (${box.score}) and (${box.classScore}) to be a number between [0, 1]`);
        }
    }
    constructor(box, label, score, classScore) {
        super(box, label);
        this._score = score;
        this._classScore = classScore;
    }
    get score() { return this._score; }
    get classScore() { return this._classScore; }
}
