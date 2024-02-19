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
    this.delimiter = options?.delimiter ?? ",";
    this.escape = options?.escape ?? "auto";
    this.withNewLine = options?.withNewLine ?? true;
    this.newLine = this.withNewLine ? options?.newLine ?? "\n" : "";
    const DO_ESCAPE_TARGETS = ['"', "\n"];
    const DO_ESCAPE_ENCLOSURE = /\"/g;
    const escapeImpl = (s) => '"' + s.replace(DO_ESCAPE_ENCLOSURE, '""') + '"';
    this.doEscape = typeof this.escape !== "string" ? this.escape : this.escape === "auto" ? (s) => DO_ESCAPE_TARGETS.includes(s) ? escapeImpl(s) : s : this.escape === "all" ? escapeImpl : (s) => s;
  }
  async *pullpush(data) {
    await this.push(data);
    while (this.queue.more()) {
      const value = this.queue.pop();
      const line = Object.keys(value).map((k) => this.doEscape(value[k]?.toString() ?? "")).join(this.delimiter);
      const pushed = yield line + this.newLine;
      await this.push(pushed);
    }
  }
}
export {
  CsvLineEncoder
};
//# sourceMappingURL=CsvLineEncoder.js.map
