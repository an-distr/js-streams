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

export interface JsonDeserializerStreamOptions {
  lineSeparated?: boolean
  parse?: (text: string) => any
}

export class JsonDeserializerStream<O = any> extends TransformStream<string, O> {
  constructor(options?: JsonDeserializerStreamOptions) {
    const lineSeparated: boolean = options?.lineSeparated === true
    const parse: (text: string) => any = options?.parse ?? JSON.parse

    const sanitizeForJson = (value: string) => {
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

    const sanitize = lineSeparated
      ? (value: string) => {
        value = value
          .split("\r\n").filter(Boolean).join("\n")
          .split("\n").filter(Boolean).join(",")
        return sanitizeForJson(value)
      }
      : sanitizeForJson

    const indexOfLastSeparator = lineSeparated
      ? (value: string): number | undefined => {
        for (let i = value.length - 1; i >= 0; i--) {
          if (value[i] === "\n") {
            return i
          }
        }
      }
      : (value: string): number | undefined => {
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

    let buffer = ""

    super({
      transform(chunk, controller) {
        buffer += chunk
        const lastSeparator = indexOfLastSeparator(buffer)
        if (lastSeparator) {
          const json = "[" + sanitize(buffer.slice(0, lastSeparator)) + "]"
          const arr = parse(json)
          for (const a of arr) {
            controller.enqueue(a)
          }
          buffer = buffer.slice(lastSeparator)
        }
      },
      flush(controller) {
        if (buffer.length > 0) {
          const json = "[" + sanitize(buffer) + "]"
          const arr = parse(json)
          for (const a of arr) {
            controller.enqueue(a)
          }
        }
      }
    })
  }
}