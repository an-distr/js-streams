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
const bitsToStr = /* @__PURE__ */ new Map([
  ["000000", "A"],
  ["000001", "B"],
  ["000010", "C"],
  ["000011", "D"],
  ["000100", "E"],
  ["000101", "F"],
  ["000110", "G"],
  ["000111", "H"],
  ["001000", "I"],
  ["001001", "J"],
  ["001010", "K"],
  ["001011", "L"],
  ["001100", "M"],
  ["001101", "N"],
  ["001110", "O"],
  ["001111", "P"],
  ["010000", "Q"],
  ["010001", "R"],
  ["010010", "S"],
  ["010011", "T"],
  ["010100", "U"],
  ["010101", "V"],
  ["010110", "W"],
  ["010111", "X"],
  ["011000", "Y"],
  ["011001", "Z"],
  ["011010", "a"],
  ["011011", "b"],
  ["011100", "c"],
  ["011101", "d"],
  ["011110", "e"],
  ["011111", "f"],
  ["100000", "g"],
  ["100001", "h"],
  ["100010", "i"],
  ["100011", "j"],
  ["100100", "k"],
  ["100101", "l"],
  ["100110", "m"],
  ["100111", "n"],
  ["101000", "o"],
  ["101001", "p"],
  ["101010", "q"],
  ["101011", "r"],
  ["101100", "s"],
  ["101101", "t"],
  ["101110", "u"],
  ["101111", "v"],
  ["110000", "w"],
  ["110001", "x"],
  ["110010", "y"],
  ["110011", "z"],
  ["110100", "0"],
  ["110101", "1"],
  ["110110", "2"],
  ["110111", "3"],
  ["111000", "4"],
  ["111001", "5"],
  ["111010", "6"],
  ["111011", "7"],
  ["111100", "8"],
  ["111101", "9"],
  ["111110", "+"],
  ["111111", "/"]
]);
const strToBits = new Map(function* () {
  for (const entry of bitsToStr.entries()) {
    yield [entry[1], entry[0]];
  }
}());
class Base64Encoder extends PullPush {
  constructor() {
    super(new PullPushNonQueue());
    this.bits = [];
    this.block = [];
  }
  async push(data) {
    if (!data) {
      return;
    }
    for (const n of data) {
      for (const c of n.toString(2).padStart(8, "0")) {
        if (c === "0")
          this.bits.push(0);
        else if (c === "1")
          this.bits.push(1);
      }
    }
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      while (this.bits.length >= 6) {
        const bits = this.bits.splice(0, 6).join("");
        this.block.push(bitsToStr.get(bits));
      }
      while (this.block.length >= 4) {
        const next = yield this.block.splice(0, 4).join("");
        await this.push(next);
      }
      if (flush) {
        if (this.bits.length > 0) {
          const bits = this.bits.splice(0, 6).join("").padEnd(6, "0");
          this.block.push(bitsToStr.get(bits));
          const next = yield this.block.splice(0, 4).join("").padEnd(4, "=");
          await this.push(next);
        }
      } else {
        break;
      }
    } while (this.bits.length > 0);
  }
}
class Base64Decoder extends PullPush {
  constructor() {
    super(new PullPushNonQueue());
    this.bits = [];
    this.buffer = [];
  }
  async push(data) {
    if (!data) {
      return;
    }
    for (const s of data) {
      for (const n of strToBits.get(s) ?? "") {
        if (n === "0")
          this.bits.push(0);
        else if (n === "1")
          this.bits.push(1);
      }
    }
  }
  async *pullpush(data, flush) {
    await this.push(data);
    do {
      while (this.bits.length >= 8) {
        const byte = this.bits.splice(0, 8).join("");
        this.buffer.push(parseInt(byte, 2));
      }
      if (this.buffer.length > 0) {
        const next = yield new Uint8Array(this.buffer);
        this.buffer.length = 0;
        await this.push(next);
      }
      if (flush) {
        this.bits.length = 0;
        this.buffer.length = 0;
      } else {
        break;
      }
    } while (this.bits.length > 0);
  }
}
export {
  Base64Decoder,
  Base64Encoder
};
//# sourceMappingURL=Base64Streams.js.map
