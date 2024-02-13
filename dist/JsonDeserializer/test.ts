import { JsonDeserializer, JsonDeserializerOptions } from "./JsonDeserializer.ts"
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

const time = async (fn: () => Promise<void>) => {
  performance.clearMarks("start")
  performance.clearMarks("end")
  performance.clearMeasures("perf")

  performance.mark("start")
  await fn()
  performance.mark("end")
  performance.measure("perf", "start", "end")
  const perf = performance.getEntriesByName("perf")[0]
  console.log(perf.duration)
}

const deserializer = async (options?: JsonDeserializerOptions) => new JsonDeserializer(options).transform()

const json = '[\t\r\n{"a":1,"b":2}\t,\r\n{"a":3,"b":4},{"a":5,"b":6}\t,\r\n]'
const jsonl = '{"a":1,"b":2}\n{"a":3\t,"b":4}\r\n{"a":5,"b":6}'

const bigJson = (count: number) => {
  const a: string[] = []
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}')
  }
  return "[" + a.join(",") + "]"
}

const bigJsonLine = (count: number) => {
  const a: string[] = []
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}')
  }
  return a.join("\n")
}

const test = async () => {
  console.group("JSON")
  {
    await source(json)
      .pipeThrough(await deserializer(undefined))
      .pipeTo(logging())
  }
  console.groupEnd()

  console.group("JSON Lines")
  {
    await source(jsonl)
      .pipeThrough(await deserializer({ lineSeparated: true }))
      .pipeTo(logging())
  }
  console.groupEnd()

  await sleep(0)

  console.group("Performance test")
  {
    const count = 100000
    console.log("count", count)

    const json = bigJson(count)
    const jsonl = bigJsonLine(count)

    console.group("JSON")
    await time(async () => {
      await source(json)
        .pipeThrough(await deserializer(undefined))
        .pipeTo(terminate())
    })
    console.groupEnd()

    await sleep(0)

    console.group("JSON Lines")
    await time(async () => {
      await source(jsonl)
        .pipeThrough(await deserializer({ lineSeparated: true }))
        .pipeTo(terminate())
    })
    console.groupEnd()
  }
  console.groupEnd()

  await sleep(0)
}

console.group("JsonDeserializer")
await test()
console.groupEnd()

console.log("Test completed.")