import { JsonDeserializer, JsonDeserializerOptions } from "./JsonDeserializer.ts"
import { PerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.ts"
import { sleep } from "../funcs/sleep/sleep.ts"

const source = (s: string) => new ReadableStream({
  start(controller) {
    controller.enqueue(s)
    controller.close()
  }
})

const logging = () => new WritableStream({
  write(chunk) {
    console.log(chunk)
  }
})

const terminate = () => new WritableStream()

const testPerformance = async (data: string, options?: JsonDeserializerOptions) => {
  const builder = new PerformanceStreamBuilder("perf", "start", "end")

  await source(data)
    .pipeThrough(builder
      .pipe(deserializer(options))
      .build())
    .pipeTo(terminate())

  console.table(builder.result())
}

const deserializer = (options?: JsonDeserializerOptions) => new JsonDeserializer(options).transformable()

const json = '[\t\r\n{"a":1,"b":2}\t,\r\n{"a":3,"b":4\r},{"a":5,"b":6}\t,\r\n]'
const jsonl = '{"a":1,"b"  :2 }\n{"a":3\t,"b"\t:4}\r\n{"a":5,"b":6}\r'
const jsonc = `[\t\r\n{"a":1,"b":2/* test
abc*/\r}\t,\r\n{"a":3,"b":4}, // test
{"a":5,"b":6}\t,\r\n]`

const bigJson = (count: number) => {
  const a: string[] = []
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}')
  }
  return "[" + a.join(",") + "]"
}

const bigJsonLines = (count: number) => {
  const a: string[] = []
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}')
  }
  return a.join("\n")
}

const bigJsonWithComments = (count: number) => {
  const a: string[] = []
  for (let i = 0; i < count; ++i) {
    a.push(`{"a":1/* test
    abc */,"b":2} // test
    `)
  }
  return "[" + a.join(",") + "]"
}

const test = async () => {
  console.group("JSON")
  {
    await source(json)
      .pipeThrough(deserializer(undefined))
      .pipeTo(logging())
  }
  console.groupEnd()

  console.group("JSON Lines")
  {
    await source(jsonl)
      .pipeThrough(deserializer({ lineSeparated: true }))
      .pipeTo(logging())
  }
  console.groupEnd()

  console.group("JSON with comments")
  {
    await source(jsonc)
      .pipeThrough(deserializer({ withComments: true }))
      .pipeTo(logging())
  }
  console.groupEnd()

  await sleep()

  console.group("Performance test")
  {
    const count = 100000
    console.log("count", count)

    const json = bigJson(count)
    const jsonl = bigJsonLines(count)
    const jsonc = bigJsonWithComments(count)

    console.group("JSON")
    await testPerformance(json)
    console.groupEnd()

    await sleep()

    console.group("JSON Lines")
    await testPerformance(jsonl, { lineSeparated: true })
    console.groupEnd()

    await sleep()

    console.group("JSON with comments")
    await testPerformance(jsonc, { withComments: true })
    console.groupEnd()
  }
  console.groupEnd()

  await sleep()
}

console.group("JsonDeserializer")
await test()
console.groupEnd()

console.log("Test completed.")