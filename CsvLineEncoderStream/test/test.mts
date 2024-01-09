import { CsvLineEncoder } from "../CsvLineEncoder.mjs"

(async () => {

  const readable = (data: any[]) => new ReadableStream({
    start(controller) {
      for (const chunk of data) {
        controller.enqueue(chunk)
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

  const data = [
    { "a": 1, "b": 2, "c": "aaa\nbbb,ccc" },
    { "a": 4, "b": 5, "c": 6 },
    { "a": 7, "b": 8, "c": 9 },
    { "c1": "a", "c2": "b", "c3": "c", "c4": "d" },
  ]

  console.groupCollapsed("=== escape: all ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder({ escape: "all" }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("=== escape: auto ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder({ escape: "auto" }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("=== escape: none ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder({ escape: "none" }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("=== escape: custom ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder(undefined, { escape: s => `[${s}]` }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("=== delimiter: custom ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder(undefined, { delimiter: "|" }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("=== newLine: custom ===")
  await readable(data)
    .pipeThrough(new CsvLineEncoder(undefined, { newLine: "|" }).transform())
    .pipeThrough(logger())
    .pipeTo(new WritableStream)
  console.groupEnd()

  console.groupCollapsed("\n=== no new line ===")
  let text = ""
  await readable(data)
    .pipeThrough(new CsvLineEncoder(undefined, { withNewLine: false }).transform())
    .pipeTo(new WritableStream({
      write(chunk) {
        text += chunk
      }
    }))
  console.log(text)
  console.groupEnd()

  console.log("\nTest completed.")

})()