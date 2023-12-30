import { JsonSerializerStream } from "../JsonSerializerStream.mjs"

(async () => {
  const readable = (objs: any[]) => new ReadableStream({
    start(controller) {
      for (const obj of objs) {
        controller.enqueue(obj)
      }
      controller.close()
    }
  })

  const logger = () => new WritableStream({
    write(chunk) {
      console.log(chunk)
    }
  })

  const objs = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
    { a: 5, b: 6 },
  ]

  console.log("=== JSON ===")
  await readable(objs)
    .pipeThrough(new JsonSerializerStream)
    .pipeTo(logger())

  console.log("=== JSON Lines ===")
  await readable(objs)
    .pipeThrough(new JsonSerializerStream({ lineSeparated: true }))
    .pipeTo(logger())

  console.log("Test completed.")
})()