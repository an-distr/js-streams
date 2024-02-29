import { BaseDecoder, BaseEncoder, BaseType } from "./BaseStreams.ts"
import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams/Utf8Streams.ts"
import { PerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.ts"
import { sleep } from "../funcs/sleep/sleep.ts"

const textSource = (data: string[]) => new ReadableStream<string>({
  start(controller) {
    for (const d of data) {
      controller.enqueue(d)
    }
    controller.close()
  }
})

const binarySource = (data: Uint8Array) => new ReadableStream<Uint8Array>({
  start(controller) {
    controller.enqueue(data)
    controller.close()
  }
})

const peek = (result: { encoded: string }) => new TransformStream({
  transform(chunk, controller) {
    result.encoded += chunk
    controller.enqueue(chunk)
  }
})

const terminate = (result: { decoded: string | Array<number> }) => new WritableStream({
  write(chunk) {
    if (typeof result.decoded === "string") {
      result.decoded += chunk
    }
    else {
      result.decoded = result.decoded.concat([...chunk])
    }
  }
})

const testText = async (mode: BaseType, data: string[]) => {
  console.group("Testing(text):", mode)

  const result = {
    encoded: "",
    decoded: "",
  }

  await textSource(data)
    .pipeThrough(new Utf8EncoderStream())
    .pipeThrough(new BaseEncoder(mode).transformable())
    .pipeThrough(peek(result))
    .pipeThrough(new BaseDecoder(mode).transformable())
    .pipeThrough(new Utf8DecoderStream())
    .pipeTo(terminate(result))

  console.log("source:", data.join(""), "(", data.join("").length, ")")
  console.log(`${mode}:`, result.encoded, "(", result.encoded.length, ")")
  console.log("decoded:", result.decoded, "(", result.decoded.length, ")")
  console.assert(
    result.decoded === data.join(""),
    "data=[", JSON.stringify(data.join("")), "](", data.join("").length, ")",
    "result=[", JSON.stringify(result.decoded), "](", result.decoded.length, "),",
  )
  console.groupEnd()
}

const testBinary = async (mode: BaseType, data: Uint8Array) => {
  console.group("Testing(binary):", mode)

  const result = {
    encoded: "",
    decoded: [],
  }

  const encodePerf = new PerformanceStreamBuilder("encode_perf", "encode_start", "encode_end")
  const decodePerf = new PerformanceStreamBuilder("decode_perf", "decode_start", "decode_end")

  await binarySource(data)
    .pipeThrough(encodePerf.pipe(new BaseEncoder(mode).transformable()).build())
    .pipeThrough(peek(result))
    .pipeThrough(decodePerf.pipe(new BaseDecoder(mode).transformable()).build())
    .pipeTo(terminate(result))

  console.log("source:", "(", data.byteLength, ")")
  console.log(`${mode}:`, "(", result.encoded.length, ")")
  console.log("decoded:", "(", result.decoded.length, ")")
  console.assert(
    result.decoded.every((x, i) => x === data[i]),
    "data=[", data, "](", data.byteLength, ")",
    "result=[", result.decoded, "](", result.decoded.length, "),",
  )

  console.group("Encode performance")
  console.table(encodePerf.result())
  console.groupEnd()
  console.group("Decode performance")
  console.table(decodePerf.result())
  console.groupEnd()

  console.groupEnd()
}

const modes: BaseType[] = [
  "base16",
  "base32",
  "base32hex",
  "base64",
  "base64url",
]

const stringData = [
  "Hello, World.",
]

const binaryData = new Uint8Array(8192)
for (let i = 0; i < binaryData.byteLength; ++i) {
  binaryData[i] = Math.random() * 256
}

for (const mode of modes) {
  await testText(mode, stringData)
  await sleep()
  await testBinary(mode, binaryData)
  await sleep()
}

console.log("Test completed.")