import { env } from '../env/index';
export function resolveInput(arg) {
    if (!env.isNodejs() && typeof arg === 'string') {
        return document.getElementById(arg);
    }
    return arg;
}
