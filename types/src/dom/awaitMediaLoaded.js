import { env } from '../env/index';
import { isMediaLoaded } from './isMediaLoaded';
export function awaitMediaLoaded(media) {
    // eslint-disable-next-line consistent-return
    return new Promise((resolve, reject) => {
        if (media instanceof env.getEnv().Canvas || isMediaLoaded(media))
            resolve(null);
        function onError(e) {
            if (!e.currentTarget)
                return;
            // eslint-disable-next-line no-use-before-define
            e.currentTarget.removeEventListener('load', onLoad);
            e.currentTarget.removeEventListener('error', onError);
            reject(e);
        }
        function onLoad(e) {
            if (!e.currentTarget)
                return;
            e.currentTarget.removeEventListener('load', onLoad);
            e.currentTarget.removeEventListener('error', onError);
            resolve(e);
        }
        media.addEventListener('load', onLoad);
        media.addEventListener('error', onError);
    });
}
