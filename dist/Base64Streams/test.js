import { Base64Decoder, Base64Encoder } from "./Base64Streams.js";
import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams/Utf8Streams.js";
const source = (data2) => new ReadableStream({
  start(controller) {
    for (const d of data2) {
      controller.enqueue(d);
    }
    controller.close();
  }
});
const logging = (prefix) => new TransformStream({
  transform(chunk, controller) {
    console.log(prefix, JSON.stringify(chunk));
    controller.enqueue(chunk);
  }
});
const result = {
  encoded: "",
  decoded: ""
};
const peek = (result2) => new TransformStream({
  transform(chunk, controller) {
    result2.encoded += chunk;
    controller.enqueue(chunk);
  }
});
const terminate = (result2) => new WritableStream({
  write(chunk) {
    result2.decoded += chunk;
  }
});
const data = [
  "hello",
  ",",
  "world",
  ".!"
];
await source(data).pipeThrough(logging("Source :")).pipeThrough(new Utf8EncoderStream()).pipeThrough(new Base64Encoder().transformable()).pipeThrough(logging("Encoded:")).pipeThrough(peek(result)).pipeThrough(new Base64Decoder().transformable()).pipeThrough(new Utf8DecoderStream()).pipeThrough(logging("Decoded:")).pipeTo(terminate(result));
console.assert(
  result.decoded === data.join(""),
  "data=[",
  JSON.stringify(data.join("")),
  "](",
  data.join("").length,
  ")",
  "result=[",
  JSON.stringify(result.decoded),
  "](",
  result.decoded.length,
  "),"
);
console.log("Base64:", result.encoded, "(", result.encoded.length, ")");
console.log("Result:", result.decoded, "(", result.decoded.length, ")");
console.log("Test completed.");
//# sourceMappingURL=test.js.map
