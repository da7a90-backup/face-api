export const FACE_EXPRESSION_LABELS = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
export class FaceExpressions {
    constructor(probabilities) {
        this.neutral = 0;
        this.happy = 0;
        this.sad = 0;
        this.angry = 0;
        this.fearful = 0;
        this.disgusted = 0;
        this.surprised = 0;
        if (probabilities.length !== 7) {
            throw new Error(`FaceExpressions.constructor - expected probabilities.length to be 7, have: ${probabilities.length}`);
        }
        FACE_EXPRESSION_LABELS.forEach((expression, idx) => {
            this[expression] = probabilities[idx];
        });
    }
    asSortedArray() {
        return FACE_EXPRESSION_LABELS
            .map((expression) => ({ expression, probability: this[expression] }))
            .sort((e0, e1) => e1.probability - e0.probability);
    }
}
