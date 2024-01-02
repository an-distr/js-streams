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
export class SourceStream extends ReadableStream {
    constructor(source, strategy) {
        super({
            start(controller) {
                var _a;
                if (source) {
                    if (Array.isArray(source)) {
                        for (const chunk of source) {
                            controller.enqueue(chunk);
                        }
                    }
                    else if (ArrayBuffer.isView(source)) {
                        const chunkSize = (_a = controller.desiredSize) !== null && _a !== void 0 ? _a : 1;
                        for (let pos = 0; pos < source.byteLength; pos += chunkSize) {
                            controller.enqueue(source.buffer.slice(pos, pos + chunkSize));
                        }
                    }
                    else {
                        controller.enqueue(source);
                    }
                }
                controller.close();
            }
        }, strategy);
    }
}
//# sourceMappingURL=SourceStream.mjs.map