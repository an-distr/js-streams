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
class JsonDeserializer extends PullPush {
  constructor(options) {
    super(new PullPushStringQueue());
    this.lineSeparated = options?.lineSeparated === true;
    this.parse = options?.parse ?? JSON.parse;
    const SANITIZE_FOR_JSON_STARTS = [",", "[", " ", "\r", "\n", "	"];
    const SANITIZE_FOR_JSON_ENDS = [",", "]", " ", "\r", "\n", "	"];
    const sanitizeForJson = (value) => {
      const l = value.length - 1;
      let s, e;
      for (s = 0; s < l; ++s) {
        if (!SANITIZE_FOR_JSON_STARTS.includes(value[s])) {
          break;
        }
      }
      for (e = l; e >= 0; --e) {
        if (!SANITIZE_FOR_JSON_ENDS.includes(value[e])) {
          break;
        }
      }
      return value.slice(s, e + 1);
    };
    this.sanitize = this.lineSeparated ? (value) => sanitizeForJson(
      value.split("\r\n").join("\n").split("\n").join(",")
    ) : sanitizeForJson;
    this.indexOfLastSeparator = this.lineSeparated ? (value) => value.lastIndexOf("\n") : (value) => {
      const length = value.length - 1;
      let nextStart = -1;
      let separator = -1;
      for (let i = length; i >= 0; --i) {
        const s = value[i];
        if (s === "{") {
          nextStart = i;
        } else if (s === ",") {
          separator = i;
        } else if (s === "}") {
          if (nextStart > separator && separator > i) {
            return separator;
          }
        }
      }
      return -1;
    };
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      const lastSeparator = this.indexOfLastSeparator(this.queue.all());
      if (lastSeparator >= 0) {
        const json = this.sanitize(this.queue.splice(0, lastSeparator));
        await this.push(yield* this.parse("[" + json + "]"));
      }
      if (flush) {
        if (this.queue.more()) {
          const json = this.sanitize(this.queue.all());
          await this.push(yield* this.parse("[" + json + "]"));
          this.queue.empty();
        }
      } else {
        break;
      }
    } while (this.queue.more());
  }
}
export {
  JsonDeserializer
};
//# sourceMappingURL=JsonDeserializer.js.map
