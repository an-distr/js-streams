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
import { PullPush, PullPushNonQueue } from "../PullPush/PullPush.js";
const MAP_BASE16 = "0123456789ABCDEF";
const MAP_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const MAP_BASE32_HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV";
const MAP_BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const MAP_BASE64_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function createContext(mode) {
  const context = {};
  context.bitsPerByte = 8;
  mode ??= "base64";
  mode = mode.toLowerCase();
  switch (mode) {
    case "base16":
      context.map = MAP_BASE16;
      context.bitLen = 4;
      context.padLen = 1;
      break;
    case "base32":
    case "base32hex":
      context.map = mode === "base32hex" ? MAP_BASE32_HEX : MAP_BASE32;
      context.bitLen = 5;
      context.padLen = 8;
      break;
    case "base64":
    case "base64url":
      context.map = mode === "base64url" ? MAP_BASE64_URL : MAP_BASE64;
      context.bitLen = 6;
      context.padLen = 4;
      break;
    default:
      throw new Error("Unsupported");
  }
  return context;
}
class BaseEncoder extends PullPush {
  constructor(arg) {
    super(new PullPushNonQueue());
    this.inputBuffer = [];
    this.outputBuffer = [];
    if (typeof arg === "string") {
      this.context = createContext(arg);
    } else {
      this.context = arg ?? createContext();
    }
  }
  async push(data) {
    const bytes = !data ? [] : [...data];
    for (const b of bytes) {
      for (const n of b.toString(2).padStart(this.context.bitsPerByte, "0")) {
        this.inputBuffer.push(n === "0" ? 0 : 1);
      }
    }
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      while (this.inputBuffer.length >= this.context.bitLen) {
        const bits = parseInt(this.inputBuffer.splice(0, this.context.bitLen).join(""), 2);
        this.outputBuffer.push(this.context.map[bits]);
      }
      while (this.outputBuffer.length >= this.context.padLen) {
        const next = yield this.outputBuffer.splice(0, this.context.padLen).join("");
        await this.push(next);
      }
      if (flush) {
        if (this.inputBuffer.length > 0) {
          const bits = parseInt(this.inputBuffer.splice(0, this.context.bitLen).join("").padEnd(this.context.bitLen, "0"), 2);
          this.outputBuffer.push(this.context.map[bits]);
          const next = yield this.outputBuffer.splice(0, this.context.padLen).join("").padEnd(this.context.padLen, "=");
          await this.push(next);
        }
      } else {
        break;
      }
    } while (this.inputBuffer.length > 0);
  }
}
class BaseDecoder extends PullPush {
  constructor(arg) {
    super(new PullPushNonQueue());
    this.inputBuffer = [];
    this.outputBuffer = [];
    if (typeof arg === "string") {
      this.context = createContext(arg);
    } else {
      this.context = arg ?? createContext();
    }
  }
  async push(data) {
    const strarr = !data ? [] : [...data];
    for (const s of strarr) {
      for (const c of s) {
        const index = this.context.map.indexOf(c);
        if (index >= 0) {
          for (const n of index.toString(2).padStart(this.context.bitLen, "0")) {
            switch (n) {
              case "0":
                this.inputBuffer.push(0);
                break;
              case "1":
                this.inputBuffer.push(1);
                break;
            }
          }
        }
      }
    }
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      while (this.inputBuffer.length >= this.context.bitsPerByte) {
        const byte = this.inputBuffer.splice(0, this.context.bitsPerByte).join("");
        this.outputBuffer.push(parseInt(byte, 2));
      }
      if (this.outputBuffer.length > 0) {
        const next = yield new Uint8Array(this.outputBuffer);
        this.outputBuffer.length = 0;
        await this.push(next);
      }
      if (flush) {
        this.inputBuffer.length = 0;
        this.outputBuffer.length = 0;
      } else {
        break;
      }
    } while (this.inputBuffer.length > 0);
  }
}
export {
  BaseDecoder,
  BaseEncoder
};
//# sourceMappingURL=BaseStreams.js.map
