import { getCenterPoint } from '../utils/index';
import { FaceLandmarks } from './FaceLandmarks';
export class FaceLandmarks5 extends FaceLandmarks {
    getRefPointsForAlignment() {
        const pts = this.positions;
        return [
            pts[0],
            pts[1],
            getCenterPoint([pts[3], pts[4]]),
        ];
    }
}
