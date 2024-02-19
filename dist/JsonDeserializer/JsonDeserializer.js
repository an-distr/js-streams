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
    this.withComments = options?.withComments === true;
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
    const replace = (source, pattern, replacement) => source.split(pattern).join(replacement);
    const REMOVE_COMMENTS_PATTERN_1 = /\/\*.*\*\//g;
    const REMOVE_COMMENTS_PATTERN_2 = /\/\/.*\n/g;
    const REMOVE_COMMENTS_PATTERN_3 = /\/\/.*$/g;
    const removeComments = this.withComments ? (value) => replace(
      replace(
        replace(
          value,
          REMOVE_COMMENTS_PATTERN_1,
          ""
        ),
        REMOVE_COMMENTS_PATTERN_2,
        ""
      ),
      REMOVE_COMMENTS_PATTERN_3,
      ""
    ) : (value) => value;
    const SANITIZE_CRLF = /\r\n/g;
    const SANITIZE_LF = /\n/g;
    this.sanitize = this.lineSeparated ? (value) => removeComments(sanitizeForJson(value.replace(SANITIZE_CRLF, "\n").replace(SANITIZE_LF, ","))) : (value) => removeComments(sanitizeForJson(value));
    this.indexOfLastSeparator = this.lineSeparated ? (value) => value.lastIndexOf("\n") : (value) => {
      const length = value.length - 1;
      let nextStart = -1;
      let separator = -1;
      for (let i = length; i >= 0; --i) {
        const c = value[i];
        if (c === "{") {
          nextStart = i;
        } else if (c === ",") {
          separator = i;
        } else if (c === "}") {
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
        const range = this.queue.splice(0, lastSeparator);
        const json = this.sanitize(range);
        const pushed = yield* this.parse("[" + json + "]");
        await this.push(pushed);
      }
      if (flush) {
        if (this.queue.more()) {
          const range = this.queue.all();
          const json = this.sanitize(range);
          const pushed = yield* this.parse("[" + json + "]");
          this.queue.empty();
          await this.push(pushed);
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
