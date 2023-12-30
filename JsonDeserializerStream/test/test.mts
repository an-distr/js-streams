import { JsonDeserializerStream } from "../JsonDeserializerStream.mjs"

(async () => {
  const readable = (s: string) => new ReadableStream({
    start(controller) {
      controller.enqueue(s)
      controller.close()
    }
  })

  const logger = () => new WritableStream({
    write(chunk) {
      console.log(chunk)
    }
  })

  console.log("=== JSON ===")
  const json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]'
  await readable(json)
    .pipeThrough(new JsonDeserializerStream)
    .pipeTo(logger())

  console.log("=== JSON Lines ===")
  const jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}'
  await readable(jsonl)
    .pipeThrough(new JsonDeserializerStream({ lineSeparated: true }))
    .pipeTo(logger())

  console.log("Test completed.")
})()