import * as tf from '../../dist/tfjs.esm';
import { extractFaces, extractFaceTensors } from '../dom/index';
import { isWithFaceLandmarks } from '../factories/WithFaceLandmarks';
export async function extractAllFacesAndComputeResults(parentResults, input, 
// eslint-disable-next-line no-unused-vars
computeResults, extractedFaces, 
// eslint-disable-next-line no-unused-vars
getRectForAlignment = ({ alignedRect }) => alignedRect) {
    const faceBoxes = parentResults.map((parentResult) => (isWithFaceLandmarks(parentResult)
        ? getRectForAlignment(parentResult)
        : parentResult.detection));
    const faces = extractedFaces || (input instanceof tf.Tensor
        ? await extractFaceTensors(input, faceBoxes)
        : await extractFaces(input, faceBoxes));
    const results = await computeResults(faces);
    faces.forEach((f) => f instanceof tf.Tensor && f.dispose());
    return results;
}
export async function extractSingleFaceAndComputeResult(parentResult, input, 
// eslint-disable-next-line no-unused-vars
computeResult, extractedFaces, 
// eslint-disable-next-line no-unused-vars
getRectForAlignment) {
    return extractAllFacesAndComputeResults([parentResult], input, async (faces) => computeResult(faces[0]), extractedFaces, getRectForAlignment);
}
