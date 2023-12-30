import { CsvLineEncoderStream } from "../CsvLineEncoderStream.mjs"

(async () => {
  const readable = () => new ReadableStream({
    start(controller) {
      const objs = [
        { "a": 1, "b": 2, "c": "aaa\nbbb,ccc" },
        { "a": 4, "b": 5, "c": 6 },
        { "a": 7, "b": 8, "c": 9 },
        { "c1": "a", "c2": "b", "c3": "c", "c4": "d" },
      ]
      for (const obj of objs) {
        controller.enqueue(obj)
      }
      controller.close()
    }
  })

  const logger = () => new TransformStream({
    transform(chunk, controller) {
      console.log(chunk)
      controller.enqueue(chunk)
    }
  })

  console.log("=== escape: all ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ escape: "all" }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("=== escape: auto ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ escape: "auto" }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("=== escape: none ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ escape: "none" }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("=== escape: custom ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ escape: s => `[${s}]` }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("=== delimiter: custom ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ delimiter: "|" }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("=== newLine: custom ===")
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ newLine: "|" }))
    .pipeThrough(logger())
    .pipeTo(new WritableStream)

  console.log("\n=== no new line ===")
  let text = ""
  await readable()
    .pipeThrough(new CsvLineEncoderStream({ withNewLine: false }))
    .pipeTo(new WritableStream({
      write(chunk) {
        text += chunk
      }
    }))
  console.log(text)

  console.log("\nTest completed.")
})()