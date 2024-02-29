import { BaseDecoder, BaseEncoder } from "./BaseStreams.js";
import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams/Utf8Streams.js";
import { PerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.js";
import { sleep } from "../funcs/sleep/sleep.js";
const textSource = (data) => new ReadableStream({
  start(controller) {
    for (const d of data) {
      controller.enqueue(d);
    }
    controller.close();
  }
});
const binarySource = (data, repeat) => new ReadableStream({
  start(controller) {
    for (let i = 0; i < repeat; ++i) {
      controller.enqueue(data);
    }
    controller.close();
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
    if (typeof result.decoded === "string") {
      result.decoded += chunk;
    } else {
      result.decoded = result.decoded.concat([...chunk]);
    }
  }
});
const testText = async (mode, data) => {
  console.group("Testing(text):", mode);
  const result = {
    encoded: "",
    decoded: ""
  };
  await textSource(data).pipeThrough(new Utf8EncoderStream()).pipeThrough(new BaseEncoder(mode).transformable()).pipeThrough(peek(result)).pipeThrough(new BaseDecoder(mode).transformable()).pipeThrough(new Utf8DecoderStream()).pipeTo(terminate(result));
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
const testBinary = async (mode, data, repeat) => {
  console.group("Testing(binary):", mode, ", repeat=", repeat);
  const result = {
    encoded: "",
    decoded: []
  };
  const encodePerf = new PerformanceStreamBuilder("encode_perf", "encode_start", "encode_end");
  const decodePerf = new PerformanceStreamBuilder("decode_perf", "decode_start", "decode_end");
  await binarySource(data, repeat).pipeThrough(encodePerf.pipe(new BaseEncoder(mode).transformable()).build()).pipeThrough(peek(result)).pipeThrough(decodePerf.pipe(new BaseDecoder(mode).transformable()).build()).pipeTo(terminate(result));
  let arr = [];
  for (let i = 0; i < repeat; ++i) {
    arr = arr.concat([...data]);
  }
  data = new Uint8Array(arr);
  console.log("source:", "(", data.byteLength, ")");
  console.log(`${mode}:`, "(", result.encoded.length, ")");
  console.log("decoded:", "(", result.decoded.length, ")");
  console.assert(
    result.decoded.every((x, i) => x === data[i]),
    "data=[",
    data,
    "](",
    data.byteLength,
    ")",
    "result=[",
    result.decoded,
    "](",
    result.decoded.length,
    "),"
  );
  console.group("Encode performance");
  console.table(encodePerf.result());
  console.groupEnd();
  console.group("Decode performance");
  console.table(decodePerf.result());
  console.groupEnd();
  console.groupEnd();
};
const testBuiltinBase64 = async (data, repeat) => {
  console.group("Testing(Builtin base64):", ", repeat=", repeat);
  const result = {
    encoded: "",
    decoded: []
  };
  const encodePerf = new PerformanceStreamBuilder("encode_perf", "encode_start", "encode_end");
  const decodePerf = new PerformanceStreamBuilder("decode_perf", "decode_start", "decode_end");
  await binarySource(data, repeat).pipeThrough(new TransformStream({
    transform(chunk, controller) {
      let s = "";
      for (let i = 0; i < chunk.byteLength; ++i) {
        s += String.fromCharCode(chunk[i]);
      }
      controller.enqueue(s);
    }
  })).pipeThrough(encodePerf.pipe(new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(btoa(chunk));
    }
  })).build()).pipeThrough(peek(result)).pipeThrough(decodePerf.pipe(new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(atob(chunk));
    }
  })).build()).pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const buffer = [];
      for (let i = 0; i < chunk.length; ++i) {
        buffer.push(chunk[i].charCodeAt(0));
      }
      controller.enqueue(new Uint8Array(buffer));
    }
  })).pipeTo(terminate(result));
  let arr = [];
  for (let i = 0; i < repeat; ++i) {
    arr = arr.concat([...data]);
  }
  data = new Uint8Array(arr);
  console.log("source:", "(", data.byteLength, ")");
  console.log("base64(builtin):", "(", result.encoded.length, ")");
  console.log("decoded:", "(", result.decoded.length, ")");
  console.assert(
    result.decoded.every((x, i) => x === data[i]),
    "data=[",
    data,
    "](",
    data.byteLength,
    ")",
    "result=[",
    result.decoded,
    "](",
    result.decoded.length,
    "),"
  );
  console.group("Encode performance");
  console.table(encodePerf.result());
  console.groupEnd();
  console.group("Decode performance");
  console.table(decodePerf.result());
  console.groupEnd();
  console.groupEnd();
};
const modes = [
  "base16",
  "base32",
  "base32hex",
  "base64",
  "base64url"
];
const stringData = [
  "Hello, World."
];
const binaryData = new Uint8Array(8192);
for (let i = 0; i < binaryData.byteLength; ++i) {
  binaryData[i] = Math.random() * 255;
}
for (const mode of modes) {
  await testText(mode, stringData);
  await sleep();
  await testBinary(mode, binaryData, 3);
  await sleep();
}
await testBuiltinBase64(binaryData, 3);
console.log("Test completed.");
//# sourceMappingURL=test.js.map
