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
import { PullPush, PullPushArrayQueue } from "../PullPush/PullPush.js";
class CsvLineEncoder extends PullPush {
  constructor(options) {
    super(new PullPushArrayQueue());
    this.keys = /* @__PURE__ */ new Map();
    this.delimiter = options?.delimiter ?? ",";
    this.escape = options?.escape ?? "auto";
    this.withNewLine = options?.withNewLine ?? true;
    this.newLine = this.withNewLine ? options?.newLine ?? "\n" : "";
    this.doEscape = typeof this.escape !== "string" ? this.escape : this.escape === "auto" ? (s) => {
      if (s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/\"/g, '""') + '"';
      }
      return s;
    } : this.escape === "all" ? (s) => '"' + s.replace(/\"/g, '""') + '"' : (s) => s;
  }
  async *pullpush(data) {
    await this.push(data);
    while (this.queue.more()) {
      const value = this.queue.pop();
      const key_ = Object.keys(value).join(",");
      if (!this.keys.has(key_)) {
        const keys_ = [];
        for (const key in value) {
          keys_.push(key);
        }
        this.keys.set(key_, keys_);
      }
      const line = this.keys.get(key_).map((key) => value[key]).map((o) => o?.toString() ?? "").map(this.doEscape).join(this.delimiter);
      await this.push(yield line + this.newLine);
    }
  }
}
export {
  CsvLineEncoder
};
//# sourceMappingURL=CsvLineEncoder.js.map
