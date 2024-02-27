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
import { PullPush, PullPushStringQueue } from "../PullPush/PullPush.js";
class CsvDeserializer extends PullPush {
  constructor(options) {
    super(new PullPushStringQueue());
    this.fieldBuffer = "";
    this.prevChar = "";
    this.inField = false;
    this.fields = [];
    this.hasHeader = options?.hasHeader ?? false;
    this.autoColumnPrefix = options?.autoColumnPrefix ?? "";
    this.headers = options?.headers ?? [];
    this.delimiter = options?.delimiter ?? ",";
    this.lineSeparators = options?.lineSeparators ?? ["\r", "\n"];
    this.fieldsToObject = () => {
      const obj = {};
      if (this.headers.length === 0) {
        if (this.hasHeader) {
          this.fields.forEach((f) => this.headers.push(f));
          this.fields.length = 0;
          return void 0;
        } else {
          for (let i = 0; i < this.fields.length; ++i) {
            this.headers.push(`${this.autoColumnPrefix}${i + 1}`);
          }
        }
      }
      this.headers.forEach((h, i) => obj[h] = this.fields[i]);
      this.fields.length = 0;
      return obj;
    };
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      const length = this.queue.length();
      for (let i = 0; i < length; ++i) {
        const c = this.queue.shift();
        if (this.lineSeparators.includes(c) && !this.inField) {
          if (this.fieldBuffer.length > 0) {
            this.fields.push(this.fieldBuffer.replace(/\\\"/g, '"'));
            this.fieldBuffer = "";
          }
          if (this.fields.length > 0) {
            const obj = this.fieldsToObject();
            if (obj) {
              const next = yield obj;
              await this.push(next);
            }
          }
          this.prevChar = "";
          continue;
        } else if (c === '"' && this.prevChar !== "\\") {
          this.inField = !this.inField;
          this.prevChar = c;
          continue;
        } else if (c === this.delimiter && !this.inField) {
          this.fields.push(this.fieldBuffer.replace(/\\\"/g, '"'));
          this.prevChar = c;
          this.fieldBuffer = "";
          continue;
        } else {
          this.prevChar = c;
          this.fieldBuffer += c;
        }
      }
      if (flush) {
        this.queue.empty();
        if (this.fieldBuffer.length > 0) {
          this.fields.push(this.fieldBuffer.replace(/\\\"/g, '"'));
        }
        if (this.fields.length > 0) {
          const obj = this.fieldsToObject();
          if (obj) {
            const next = yield obj;
            await this.push(next);
          }
        }
      }
    } while (this.queue.more());
  }
}
export {
  CsvDeserializer
};
//# sourceMappingURL=CsvDeserializer.js.map
