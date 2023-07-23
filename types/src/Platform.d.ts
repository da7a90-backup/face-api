export declare class PlatformBrowser {
    private textEncoder;
    constructor();
    fetch(path: string, init?: any): Promise<Response>;
    now(): number;
    encode(text: string, encoding: string): Uint8Array;
    decode(bytes: Uint8Array, encoding: string): string;
}
