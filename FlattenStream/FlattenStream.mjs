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
export class FlattenStream extends TransformStream {
    constructor(limit) {
        const flatten = (level, chunk, controller) => {
            if (Array.isArray(chunk) && (limit !== null && limit !== void 0 ? limit : level) >= level) {
                for (const obj of chunk) {
                    flatten(level + 1, obj, controller);
                }
            }
            else {
                controller.enqueue(chunk);
            }
        };
        super({
            transform(chunk, controller) {
                flatten(0, chunk, controller);
            }
        });
    }
}
//# sourceMappingURL=FlattenStream.mjs.map