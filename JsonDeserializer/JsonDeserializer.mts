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

import { PushPull, PushPullStringQueue, PushableTypes } from "../PushPull/PushPull.mjs"

export interface JsonDeserializerOptions {
  lineSeparated?: boolean
  parse?: (text: string) => any
}

export class JsonDeserializer<O = any> extends PushPull<string, O, PushPullStringQueue> {
  private lineSeparated: boolean
  private parse: (text: string) => any
  private sanitize: (value: string) => string
  private indexOfLastSeparator: (value: string) => number | undefined

  constructor(options?: JsonDeserializerOptions) {
    super(new PushPullStringQueue)
    this.lineSeparated = options?.lineSeparated === true
    this.parse = options?.parse ?? JSON.parse

    const sanitizeForJson: (value: string) => string = value => {
      let b = true
      while (b) {
        switch (value.slice(0, 1)) {
          case ",":
          case "[":
          case " ":
          case "\r":
          case "\n":
          case "\t":
            value = value.slice(1)
            break
          default:
            b = false
        }
      }
      b = true
      while (b) {
        switch (value.slice(-1)) {
          case ",":
          case "]":
          case " ":
          case "\r":
          case "\n":
          case "\t":
            value = value.slice(0, -1)
            break
          default:
            b = false
        }
      }
      return value
    }

    this.sanitize = this.lineSeparated
      ? value => sanitizeForJson(value
        .split("\r\n").filter(Boolean).join("\n")
        .split("\n").filter(Boolean).join(",")
      )
      : sanitizeForJson

    this.indexOfLastSeparator = this.lineSeparated
      ? value => {
        for (let i = value.length - 1; i >= 0; i--) {
          if (value[i] === "\n") {
            return i
          }
        }
      }
      : value => {
        let nextStart = -1
        let separator = -1
        for (let i = value.length - 1; i >= 0; i--) {
          switch (value[i]) {
            case "{":
              nextStart = i
              break
            case ",":
              separator = i
              break
            case "}":
              if (nextStart > separator && separator > i) {
                return separator
              }
              break
          }
        }
      }
  }

  async *pushpull(data?: PushableTypes<string>, flush?: boolean) {
    await this.push(data)

    do {
      const lastSeparator = this.indexOfLastSeparator(this.queue.all())
      if (lastSeparator) {
        const json = "[" + this.sanitize(this.queue.splice(0, lastSeparator)) + "]"
        await this.push(yield* this.parse(json))
      }

      if (flush) {
        if (this.queue.more()) {
          const json = "[" + this.sanitize(this.queue.all()) + "]"
          await this.push(yield* this.parse(json))
          this.queue.empty()
        }
      }
      else {
        break
      }
    } while (this.queue.more())
  }
}