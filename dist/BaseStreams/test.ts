import { BaseDecoder, BaseEncoder, BaseType } from "./BaseStreams.ts"
import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams/Utf8Streams.ts"

const source = (data: string[]) => new ReadableStream({
  start(controller) {
    for (const d of data) {
      controller.enqueue(d)
    }
    controller.close()
  }
})

const logging = (prefix: string) => new TransformStream({
  transform(chunk, controller) {
    console.log(prefix, JSON.stringify(chunk))
    controller.enqueue(chunk)
  }
})

const peek = (result: { encoded: string }) => new TransformStream({
  transform(chunk, controller) {
    result.encoded += chunk
    controller.enqueue(chunk)
  }
})

const terminate = (result: { decoded: string }) => new WritableStream({
  write(chunk) {
    result.decoded += chunk
  }
})

const test = async (mode: BaseType) => {
  console.group("Testing:", mode)
  console.groupCollapsed("Debug info")

  const result = {
    encoded: "",
    decoded: "",
  }

  await source(data)
    .pipeThrough(logging("Source :"))
    .pipeThrough(new Utf8EncoderStream())
    .pipeThrough(new BaseEncoder(mode).transformable())
    .pipeThrough(logging("Encoded:"))
    .pipeThrough(peek(result))
    .pipeThrough(new BaseDecoder(mode).transformable())
    .pipeThrough(new Utf8DecoderStream())
    .pipeThrough(logging("Decoded:"))
    .pipeTo(terminate(result))

  console.groupEnd()
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

const modes: BaseType[] = [
  "base16",
  "base32",
  "base32hex",
  "base64",
  "base64url",
]

const data = [
  "Hello, World.",
]

for (const mode of modes) {
  await test(mode)
}

console.log("Test completed.")