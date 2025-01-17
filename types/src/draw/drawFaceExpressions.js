import { Point } from '../classes/index';
import { FaceExpressions } from '../faceExpressionNet/index';
import { isWithFaceDetection } from '../factories/WithFaceDetection';
import { isWithFaceExpressions } from '../factories/WithFaceExpressions';
import { round } from '../utils/index';
import { DrawTextField } from './DrawTextField';
export function drawFaceExpressions(canvasArg, faceExpressions, minConfidence = 0.1, textFieldAnchor) {
    const faceExpressionsArray = Array.isArray(faceExpressions) ? faceExpressions : [faceExpressions];
    faceExpressionsArray.forEach((e) => {
        // eslint-disable-next-line no-nested-ternary
        const expr = e instanceof FaceExpressions
            ? e
            : (isWithFaceExpressions(e) ? e.expressions : undefined);
        if (!expr) {
            throw new Error('drawFaceExpressions - expected faceExpressions to be FaceExpressions | WithFaceExpressions<{}> or array thereof');
        }
        const sorted = expr.asSortedArray();
        const resultsToDisplay = sorted.filter((exprLocal) => exprLocal.probability > minConfidence);
        const anchor = isWithFaceDetection(e)
            ? e.detection.box.bottomLeft
            : (textFieldAnchor || new Point(0, 0));
        const drawTextField = new DrawTextField(resultsToDisplay.map((exprLocal) => `${exprLocal.expression} (${round(exprLocal.probability)})`), anchor);
        drawTextField.draw(canvasArg);
    });
}
