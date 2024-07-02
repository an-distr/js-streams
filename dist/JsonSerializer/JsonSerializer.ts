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

import { PullPush, PullPushArrayQueue, PullPushTypes } from "../PullPush/PullPush.ts"

export interface JsonSerializerOptions {
  lineSeparated?: boolean
  stringify?: (value: any) => string
}

export class JsonSerializer<I = any> extends PullPush<I, string> {
  private lineSeparated: boolean
  private separator: string
  private stringify: (value: any) => string
  private isNotFirst: boolean

  constructor(options?: JsonSerializerOptions) {
    super(new PullPushArrayQueue)
    this.lineSeparated = options?.lineSeparated === true
    this.separator = this.lineSeparated ? "\n" : ","
    this.stringify = options?.stringify ?? JSON.stringify
    this.isNotFirst = false;
  }

  async *pullpush(data?: PullPushTypes<I>, flush?: boolean) {
    await this.push(data)

    do {
      for (const value of this.queue.splice(0)) {
        if (this.isNotFirst) {
          const next: I = yield this.separator + this.stringify(value)
          await this.push(next)
        }
        else {
          if (!this.lineSeparated) {
            const next: I = yield "["
            await this.push(next)
          }
          const next: I = yield this.stringify(value)
          await this.push(next)
          this.isNotFirst = true
        }
      }

      if (flush) {
        if (!this.lineSeparated) {
          const next: I = yield "]"
          await this.push(next)
        }
        this.isNotFirst = false
      }
    } while (this.queue.more())
  }
}