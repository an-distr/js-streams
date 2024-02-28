import { Base64DecoderStream, Base64EncoderStream } from "./Base64Streams.js";
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
    console.log(prefix, chunk);
    controller.enqueue(chunk);
  }
});
const terminate = () => new WritableStream();
const data = [
  "hello",
  ",",
  "world",
  "."
];
await source(data).pipeThrough(logging("Source :")).pipeThrough(new Utf8EncoderStream()).pipeThrough(new Base64EncoderStream()).pipeThrough(logging("Encoded:")).pipeThrough(new Base64DecoderStream()).pipeThrough(new Utf8DecoderStream()).pipeThrough(logging("Decoded:")).pipeTo(terminate());
console.log("Test completed.");
//# sourceMappingURL=test.js.map
