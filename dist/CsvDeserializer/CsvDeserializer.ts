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

import { PullPush, PullPushStringQueue, PullPushTypes } from "../PullPush/PullPush.ts"

export interface CsvDeserializerOptions {
  hasHeader?: boolean
  headers?: string[]
  delimiter?: string
  lineSeparator?: string
}

export class CsvDeserializer<O = any> extends PullPush<string, O, PullPushStringQueue> {
  private hasHeader: boolean
  private headers: string[]
  private delimiter: string
  private lineSeparator: string
  private readFields: () => AsyncGenerator<string[]>

  constructor(options?: CsvDeserializerOptions) {
    super(new PullPushStringQueue)
    this.hasHeader = options?.hasHeader ?? false
    this.headers = options?.headers ?? []
    this.delimiter = options?.delimiter ?? ","
    this.lineSeparator = options?.lineSeparator ?? "\n"

    this.readFields = async function* () {
      const text = this.queue.all()
      this.queue.empty()
      const length = text.length
      let buffer = ""
      const fields: string[] = []
      let prevChar = ""
      let inField = false
      for (let i = 0; i < length; ++i) {
        const c = text[i]
        if (c === this.lineSeparator && !inField) {
          if (buffer.length > 0) {
            fields.push(buffer.replace(/\\\"/g, "\""))
          }
          yield fields
          fields.length = 0
          prevChar = ""
          buffer = ""
          continue
        }
        else if (c === "\"" && prevChar !== "\\") {
          inField = !inField
          prevChar = c
          continue
        }
        else if (c === this.delimiter && !inField) {
          fields.push(buffer.replace(/\\\"/g, "\""))
          prevChar = c
          buffer = ""
          continue
        }
        else {
          prevChar = c
          buffer += c
        }
      }
      if (buffer.length > 0) {
        fields.push(buffer.replace(/\\\"/g, "\""))
      }
      if (fields.length > 0) {
        yield fields
      }
    }
  }

  async *pullpush(data?: PullPushTypes<string>) {
    await this.push(data)

    while (this.queue.more()) {
      for await (const fields of this.readFields()) {
        const obj = {} as any
        if (this.headers.length === 0) {
          if (this.hasHeader) {
            fields.forEach(f => this.headers.push(f))
          }
          else {
            for (let i = 0; i < fields.length; ++i) {
              this.headers.push(`column${i + 1}`)
            }
          }
          continue
        }
        this.headers.forEach((h, i) => obj[h] = fields[i])
        const next: string = yield obj as O
        await this.push(next)
      }
    }
  }
}