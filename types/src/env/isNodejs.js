export function isNodejs() {
    return typeof global === 'object'
        && typeof process !== 'undefined'
        && process.versions != null
        && process.versions.node != null;
}
