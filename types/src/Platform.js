export class PlatformBrowser {
    constructor() {
        this.textEncoder = new TextEncoder();
    }
    fetch(path, init) {
        return fetch(path, init);
    }
    now() {
        return performance.now();
    }
    encode(text, encoding) {
        if (encoding !== 'utf-8' && encoding !== 'utf8') {
            throw new Error(`Browser's encoder only supports utf-8, but got ${encoding}`);
        }
        return this.textEncoder.encode(text);
    }
    decode(bytes, encoding) {
        return new TextDecoder(encoding).decode(bytes);
    }
}
