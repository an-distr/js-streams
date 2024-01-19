/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import { PushPull, PushPullNonQueue } from "../PushPull/PushPull.js";
export class ArrayBufferAccumulator extends PushPull {
    constructor(size, options) {
        var _a;
        super(new PushPullNonQueue());
        this.size = size;
        this.fixed = (options === null || options === void 0 ? void 0 : options.forceEmit) ? false : (_a = options === null || options === void 0 ? void 0 : options.fixed) !== null && _a !== void 0 ? _a : false;
        this.buffer = new ArrayBuffer(size);
        this.bufferView = new Uint8Array(this.buffer);
        this.pos = 0;
        if (options === null || options === void 0 ? void 0 : options.forceEmit) {
            if (Array.isArray(options.forceEmit)) {
                this.forceEmit = (bytes) => {
                    const clonedBytes = [];
                    for (const byte of bytes) {
                        clonedBytes.push(byte);
                    }
                    const patterns = options.forceEmit;
                    for (let patternIndex = 0; patternIndex < patterns.length; ++patternIndex) {
                        const pattern = patterns[patternIndex];
                        let byteIndex = 0;
                        let patternByteIndex = 0;
                        for (const byte of clonedBytes.values()) {
                            if (byte !== pattern[patternByteIndex]) {
                                ++byteIndex;
                                patternByteIndex = 0;
                                continue;
                            }
                            if (pattern.length === patternByteIndex + 1) {
                                return byteIndex + pattern.length;
                            }
                            ++byteIndex;
                            ++patternByteIndex;
                        }
                    }
                    return -1;
                };
            }
            else {
                this.forceEmit = options.forceEmit;
            }
        }
    }
    async *pushpull(data, flush) {
        if (data) {
            let chunkView;
            let chunkSize;
            if (Array.isArray(data)) {
                chunkView = new Uint8Array(data);
                chunkSize = data.length;
            }
            else {
                const buffer = data;
                chunkView = new Uint8Array(buffer);
                chunkSize = buffer.byteLength;
            }
            let chunkPos = 0;
            let copySize;
            while (chunkSize > 0) {
                if (this.pos === this.size) {
                    yield this.bufferView.slice();
                    this.pos = 0;
                }
                copySize = Math.min(this.size - this.pos, chunkSize);
                this.bufferView.set(chunkView.slice(chunkPos, chunkPos + copySize), this.pos);
                this.pos += copySize;
                chunkPos += copySize;
                chunkSize -= copySize;
                if (this.forceEmit && this.pos > 0) {
                    let forceEmitPos = this.forceEmit(this.bufferView.slice(0, this.pos).values());
                    while (forceEmitPos > 0) {
                        yield this.bufferView.slice(0, forceEmitPos);
                        this.bufferView.copyWithin(0, forceEmitPos, this.size);
                        this.pos -= forceEmitPos;
                        forceEmitPos = this.forceEmit(this.bufferView.slice(0, this.pos).values());
                    }
                }
            }
        }
        if (flush && this.pos > 0) {
            if (this.forceEmit) {
                let forceEmitPos = this.forceEmit(this.bufferView.slice(0, this.pos).values());
                while (forceEmitPos > 0) {
                    yield this.bufferView.slice(0, forceEmitPos);
                    this.bufferView.copyWithin(0, forceEmitPos, this.size);
                    this.pos -= forceEmitPos;
                    forceEmitPos = this.forceEmit(this.bufferView.slice(0, this.pos).values());
                }
            }
            if (this.fixed) {
                this.bufferView.fill(0, this.pos);
                this.pos = this.size;
            }
            if (this.pos > 0) {
                yield this.bufferView.slice(0, this.pos);
            }
        }
    }
}
//# sourceMappingURL=ArrayBufferAccumulator.js.map