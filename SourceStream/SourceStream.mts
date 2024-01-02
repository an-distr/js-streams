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

export class SourceStream<R extends ArrayBufferLike | ArrayLike<any> | any> extends ReadableStream<R> {
  constructor(source: R, strategy?: QueuingStrategy<R>) {
    super({
      start(controller) {
        if (source) {
          if (Array.isArray(source)) {
            for (const chunk of source) {
              controller.enqueue(chunk)
            }
          }
          else if (ArrayBuffer.isView(source)) {
            const chunkSize = controller.desiredSize ?? 1
            for (let pos = 0; pos < source.byteLength; pos += chunkSize) {
              controller.enqueue(source.buffer.slice(pos, pos + chunkSize) as R)
            }
          }
          else {
            controller.enqueue(source)
          }
        }
        controller.close()
      }
    }, strategy)
  }
}