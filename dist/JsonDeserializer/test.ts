import { JsonDeserializer, JsonDeserializerOptions } from "./JsonDeserializer.ts"

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

const deserializer = async (options?: JsonDeserializerOptions, native?: boolean) => native
  ? (await new JsonDeserializer(options).nativization()).transform()
  : new JsonDeserializer(options).transform()

const test = async (native: boolean) => {
  console.group("JSON")
  {
    const json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]'
    await source(json)
      .pipeThrough(await deserializer(undefined, native))
      .pipeTo(logging())
  }
  console.groupEnd()

  console.group("JSON Lines")
  {
    const jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}'
    await source(jsonl)
      .pipeThrough(await deserializer({ lineSeparated: true }, native))
      .pipeTo(logging())
  }
  console.groupEnd()

  console.group("Performance test")
  {
    const count = 100000
    console.log("count", count)

    let json = "[" + '{"a":1,"b":2},'.repeat(count)
    json = json.slice(0, -1) + "]"

    const jsonl = '{"a":1,"b":2}\n'.repeat(count)

    console.group("JSON")
    await time(async () => {
      await source(json)
        .pipeThrough(await deserializer(undefined, native))
        .pipeTo(terminate())
    })
    console.groupEnd()

    console.group("JSON Lines")
    await time(async () => {
      await source(jsonl)
        .pipeThrough(await deserializer({ lineSeparated: true }, native))
        .pipeTo(terminate())
    })
    console.groupEnd()
  }
  console.groupEnd()
}

console.group("Pure JavaScript")
await test(false)
console.groupEnd()

console.group("WebAssembly")
await test(true)
console.groupEnd()

console.log("Test completed.")