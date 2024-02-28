import { Base64Decoder, Base64Encoder } from "./Base64Streams.ts"
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

const result = {
  encoded: "",
  decoded: "",
}

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

const data = [
  "hello",
  ",",
  "world",
  ".!",
]

await source(data)
  .pipeThrough(logging("Source :"))
  .pipeThrough(new Utf8EncoderStream())
  .pipeThrough(new Base64Encoder().transformable())
  .pipeThrough(logging("Encoded:"))
  .pipeThrough(peek(result))
  .pipeThrough(new Base64Decoder().transformable())
  .pipeThrough(new Utf8DecoderStream())
  .pipeThrough(logging("Decoded:"))
  .pipeTo(terminate(result))

console.assert(
  result.decoded === data.join(""),
  "data=[", JSON.stringify(data.join("")), "](", data.join("").length, ")",
  "result=[", JSON.stringify(result.decoded), "](", result.decoded.length, "),",
)
console.log("Base64:", result.encoded, "(", result.encoded.length, ")")
console.log("Result:", result.decoded, "(", result.decoded.length, ")")

console.log("Test completed.")