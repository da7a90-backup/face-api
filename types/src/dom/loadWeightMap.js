import * as tf from '../../dist/tfjs.esm';
import { getModelUris } from '../common/getModelUris';
import { fetchJson } from './fetchJson';
export async function loadWeightMap(uri, defaultModelName) {
    const { manifestUri, modelBaseUri } = getModelUris(uri, defaultModelName);
    // @ts-ignore
    const manifest = await fetchJson(manifestUri);
    // if (manifest['weightsManifest']) manifest = manifest['weightsManifest'];
    return tf['io'].loadWeights(manifest, modelBaseUri);
}
