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

import { PushPull, PushPullArrayQueue, PushableTypes } from "../PushPull/PushPull.mts"

export interface CsvLineEncoderOptions {
  delimiter?: string
  escape?: "auto" | "all" | "none" | ((s: string) => string)
  withNewLine?: boolean
  newLine?: string
}

export class CsvLineEncoder<I = any> extends PushPull<I, string> {
  private keys = new Map<string, Extract<keyof any, string>[]>()
  private delimiter: string
  private escape: string | ((s: string) => string)
  private withNewLine: boolean
  private newLine: string
  private doEscape: (s: string) => string

  constructor(options?: CsvLineEncoderOptions) {
    super(new PushPullArrayQueue)
    this.delimiter = options?.delimiter ?? ","
    this.escape = options?.escape ?? "auto"
    this.withNewLine = options?.withNewLine ?? true
    this.newLine = this.withNewLine ? (options?.newLine ?? "\n") : ""

    this.doEscape =
      typeof this.escape !== "string"
        ? this.escape
        : this.escape === "auto"
          ? s => {
            if (s.includes("\"") || s.includes("\n")) {
              return "\"" + s.replace(/\"/g, "\"\"") + "\""
            }
            return s
          }
          : this.escape === "all"
            ? s => "\"" + s.replace(/\"/g, "\"\"") + "\""
            : s => s;
  }

  async *pushpull(data?: PushableTypes<I>) {
    await this.push(data)

    while (this.queue.more()) {
      const value = this.queue.pop() as I
      const key_ = Object.keys(value as object).join(",")

      if (!this.keys.has(key_)) {
        const keys_: Extract<keyof I, string>[] = []
        for (const key in value) {
          keys_.push(key)
        }
        this.keys.set(key_, keys_)
      }

      const line = this.keys.get(key_)!
        .map(key => (value as any)[key] as object)
        .map(o => o?.toString() ?? "")
        .map(this.doEscape)
        .join(this.delimiter)

      await this.push(yield line + this.newLine)
    }
  }
}