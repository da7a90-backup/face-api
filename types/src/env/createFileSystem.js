import { isNodejs } from './isNodejs';
export function createFileSystem(fs) {
    let requireFsError = '';
    if (!fs && isNodejs()) {
        try {
            // eslint-disable-next-line global-require
            fs = require('fs');
        }
        catch (err) {
            requireFsError = err.toString();
        }
    }
    const readFile = fs
        ? (filePath) => new Promise((resolve, reject) => { fs.readFile(filePath, (err, buffer) => (err ? reject(err) : resolve(buffer))); })
        : () => { throw new Error(`readFile - failed to require fs in nodejs environment with error: ${requireFsError}`); };
    return { readFile };
}
