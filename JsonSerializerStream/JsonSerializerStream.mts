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

export interface JsonSerializerStreamOptions {
  lineSeparated?: boolean,
  stringify?: (value: any) => string,
}

export class JsonSerializerStream<I = any> extends TransformStream<I, string> {
  constructor(options?: JsonSerializerStreamOptions) {
    const lineSeparated: boolean = options?.lineSeparated === true
    const separator: string = lineSeparated ? "\n" : ","
    const stringify: (value: any) => string = options?.stringify ?? JSON.stringify

    let isNotFirst = false

    super({
      start(controller) {
        if (!lineSeparated) {
          controller.enqueue("[")
        }
      },
      transform(chunk, controller) {
        if (isNotFirst) {
          controller.enqueue(separator + stringify(chunk))
        }
        else {
          controller.enqueue(stringify(chunk))
          isNotFirst = true
        }
      },
      flush(controller) {
        if (!lineSeparated) {
          controller.enqueue("]")
        }
      }
    })
  }
}