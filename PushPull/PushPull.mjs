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
export class PushPull {
    constructor() {
        this.queue = [];
    }
    async push(data) {
        if (data !== undefined) {
            if (typeof data === "function") {
                data = (await data());
            }
            if (data === null) {
                this.queue.push(data);
            }
            else if (Array.isArray(data)) {
                for (const value of data)
                    this.queue.push(value);
            }
            else if (typeof data === "string") {
                this.queue.push(data);
            }
            else if (typeof data[Symbol.iterator] === "function") {
                for (const value of data)
                    this.queue.push(value);
            }
            else if (typeof data[Symbol.asyncIterator] === "function") {
                for await (const value of data)
                    this.queue.push(value);
            }
            else {
                this.queue.push(data);
            }
        }
        return this.queue.length;
    }
    pull(data) {
        return this.pushpull(data);
    }
    flush(data) {
        return this.pushpull(data, true);
    }
    [Symbol.asyncIterator]() {
        return this.flush();
    }
    readable(data) {
        const This = this;
        return new ReadableStream({
            async start(controller) {
                for await (const chunk of This.flush(data)) {
                    controller.enqueue(chunk);
                }
                controller.close();
            }
        });
    }
    transform() {
        const This = this;
        return new TransformStream({
            async transform(data, controller) {
                for await (const chunk of This.pull(data)) {
                    controller.enqueue(chunk);
                }
            },
            async flush(controller) {
                for await (const chunk of This.flush()) {
                    controller.enqueue(chunk);
                }
            }
        });
    }
    writable() {
        const This = this;
        return new WritableStream({
            async write(data) {
                await This.push(data);
            }
        });
    }
}
//# sourceMappingURL=PushPull.mjs.map