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

export interface CsvLineEncoderStreamEscape {
  auto: "auto"
  all: "all"
  none: "none"
}

export interface CsvLineEncoderStreamOptions {
  delimiter?: string
  escape?: keyof CsvLineEncoderStreamEscape | ((s: string) => string)
  withNewLine?: boolean
  newLine?: string
}

export class CsvLineEncoderStream<I = any> extends TransformStream<I, string> {
  constructor(options?: CsvLineEncoderStreamOptions) {
    const keys = new Map<string, Extract<keyof any, string>[]>()
    const delimiter: string = options?.delimiter ?? ","
    const escape: string | ((s: string) => string) = options?.escape ?? "auto"
    const withNewLine: boolean = options?.withNewLine ?? true
    const newLine: string = withNewLine ? (options?.newLine ?? "\n") : ""

    const doEscape =
      typeof escape !== "string"
        ? escape
        : escape === "auto"
          ? (s: string) => {
            if (s.includes("\"") || s.includes("\n")) {
              return "\"" + s.replace(/\"/g, "\"\"") + "\""
            }
            return s
          }
          : escape === "all"
            ? (s: string) => "\"" + s.replace(/\"/g, "\"\"") + "\""
            : (s: string) => s

    super({
      transform(chunk, controller) {
        let values: any[]
        if (Array.isArray(chunk)) {
          values = chunk
        }
        else {
          values = [chunk]
        }

        for (const value of values) {
          const key_ = Object.keys(value).join(",")

          if (!keys.has(key_)) {
            const keys_: Extract<keyof any, string>[] = []
            for (const key in value) {
              keys_.push(key)
            }
            keys.set(key_, keys_)
          }

          const line = keys.get(key_)!
            .map(key => value[key])
            .map(o => (o as Object)?.toString() ?? "")
            .map(doEscape)
            .join(delimiter)

          controller.enqueue(line + newLine)
        }
      }
    })
  }
}