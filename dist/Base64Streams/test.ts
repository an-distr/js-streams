import { Base64DecoderStream, Base64EncoderStream } from "./Base64Streams.ts"
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
    console.log(prefix, chunk)
    controller.enqueue(chunk)
  }
})

const terminate = () => new WritableStream()

const data = [
  "hello",
  ",",
  "world",
  ".",
]

await source(data)
  .pipeThrough(logging("Source :"))
  .pipeThrough(new Utf8EncoderStream())
  .pipeThrough(new Base64EncoderStream())
  .pipeThrough(logging("Encoded:"))
  .pipeThrough(new Base64DecoderStream())
  .pipeThrough(new Utf8DecoderStream())
  .pipeThrough(logging("Decoded:"))
  .pipeTo(terminate())

console.log("Test completed.")