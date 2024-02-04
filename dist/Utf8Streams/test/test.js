"use strict";
import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams.js";
const source = (s) => new ReadableStream({
  start(controller) {
    controller.enqueue(s);
    controller.close();
  }
});
const logging = (label) => new TransformStream({
  transform(chunk, controller) {
    console.log(label, chunk);
    controller.enqueue(chunk);
  }
});
const result = (r) => new WritableStream({
  write(chunk) {
    r.s = chunk;
  }
});
const testBuiltin = () => {
  console.group("Builtin");
  console.log("TextEncoderStream", "TextEncoderStream" in globalThis);
  console.log("TextEncoderStream", "TextDecoderStream" in globalThis);
  console.groupEnd();
};
const testProps = () => {
  console.group("Properties");
  const encoder = new Utf8EncoderStream();
  console.log("Utf8EncoderStream", {
    encoding: encoder.encoding
  });
  const decoder = new Utf8DecoderStream();
  console.log("Utf8DecoderStream", {
    encoding: decoder.encoding,
    fatal: decoder.fatal,
    ignoreBOM: decoder.ignoreBOM
  });
  console.groupEnd();
};
const test = async (s) => {
  console.group("value:", s, "type:", typeof s);
  const r = { s: null };
  await source(s).pipeThrough(logging("Before Utf8EncoderStream")).pipeThrough(new Utf8EncoderStream()).pipeThrough(logging("After Utf8EncoderStream")).pipeThrough(new Utf8DecoderStream()).pipeThrough(logging("After Utf8DecoderStream")).pipeTo(result(r));
  console.assert(s === r.s || s === void 0 && r.s === "", "Not matched.", r.s);
  console.log("Result:", r.s, "type:", typeof r.s);
  console.groupEnd();
};
testBuiltin();
testProps();
await test(void 0);
await test("");
await test("a");
await test("	a\nb");
await test("a".repeat(1024));
//# sourceMappingURL=test.js.map
