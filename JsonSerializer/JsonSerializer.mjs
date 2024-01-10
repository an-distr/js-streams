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
import { PushPull, PushPullArrayQueue } from "../PushPull/PushPull.mjs";
export class JsonSerializer extends PushPull {
    constructor(options) {
        var _a;
        super(new PushPullArrayQueue);
        this.lineSeparated = (options === null || options === void 0 ? void 0 : options.lineSeparated) === true;
        this.separator = this.lineSeparated ? "\n" : ",";
        this.stringify = (_a = options === null || options === void 0 ? void 0 : options.stringify) !== null && _a !== void 0 ? _a : JSON.stringify;
        this.isNotFirst = false;
    }
    async *pushpull(data, flush) {
        await this.push(data);
        do {
            for (const value of this.queue.splice(0)) {
                if (this.isNotFirst) {
                    await this.push(yield this.separator + this.stringify(value));
                }
                else {
                    if (!this.lineSeparated)
                        await this.push(yield "[");
                    await this.push(yield this.stringify(value));
                    this.isNotFirst = true;
                }
            }
            if (flush) {
                if (!this.lineSeparated)
                    await this.push(yield "]");
                this.isNotFirst = false;
            }
        } while (this.queue.more());
    }
}
//# sourceMappingURL=JsonSerializer.mjs.map