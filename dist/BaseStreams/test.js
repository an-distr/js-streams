import { BaseDecoder, BaseEncoder } from "./BaseStreams.js";
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
const peek = (result) => new TransformStream({
  transform(chunk, controller) {
    result.encoded += chunk;
    controller.enqueue(chunk);
  }
});
const terminate = (result) => new WritableStream({
  write(chunk) {
    result.decoded += chunk;
  }
});
const test = async (mode) => {
  console.group("Testing:", mode);
  console.groupCollapsed("Debug info");
  const result = {
    encoded: "",
    decoded: ""
  };
  await source(data).pipeThrough(logging("Source :")).pipeThrough(new Utf8EncoderStream()).pipeThrough(new BaseEncoder(mode).transformable()).pipeThrough(logging("Encoded:")).pipeThrough(peek(result)).pipeThrough(new BaseDecoder(mode).transformable()).pipeThrough(new Utf8DecoderStream()).pipeThrough(logging("Decoded:")).pipeTo(terminate(result));
  console.groupEnd();
  console.log("source:", data.join(""), "(", data.join("").length, ")");
  console.log(`${mode}:`, result.encoded, "(", result.encoded.length, ")");
  console.log("decoded:", result.decoded, "(", result.decoded.length, ")");
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
  console.groupEnd();
};
const modes = [
  "base16",
  "base32",
  "base32hex",
  "base64",
  "base64url"
];
const data = [
  "Hello, World."
];
for (const mode of modes) {
  await test(mode);
}
console.log("Test completed.");
//# sourceMappingURL=test.js.map
