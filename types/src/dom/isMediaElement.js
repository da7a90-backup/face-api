import { env } from '../env/index';
export function isMediaElement(input) {
    const { Image, Canvas, Video } = env.getEnv();
    return input instanceof Image
        || input instanceof Canvas
        || input instanceof Video;
}
