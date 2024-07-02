/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-distr)

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

export class Utf8DecoderStream extends TransformStream<BufferSource | undefined, string> {
  readonly encoding: string
  readonly fatal: boolean
  readonly ignoreBOM: boolean

  constructor() {
    const decoder = new TextDecoder()
    super({
      transform(chunk, controller) {
        controller.enqueue(decoder.decode(chunk, { stream: true }))
      }
    })
    this.encoding = decoder.encoding
    this.fatal = decoder.fatal
    this.ignoreBOM = decoder.ignoreBOM
  }
}

export class Utf8EncoderStream extends TransformStream<string | undefined, Uint8Array> {
  readonly encoding: string

  constructor() {
    const encoder = new TextEncoder()
    super({
      transform(chunk, controller) {
        controller.enqueue(encoder.encode(chunk))
      }
    })
    this.encoding = encoder.encoding
  }
}