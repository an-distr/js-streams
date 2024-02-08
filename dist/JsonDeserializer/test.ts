import { JsonDeserializer } from "./JsonDeserializer.ts"

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
  console.table(perf)
}

console.group("JSON")
let json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]'
await source(json)
  .pipeThrough(new JsonDeserializer().transform())
  .pipeTo(logging())
console.groupEnd()

console.group("JSON Lines")
let jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}'
await source(jsonl)
  .pipeThrough(new JsonDeserializer({ lineSeparated: true }).transform())
  .pipeTo(logging())
console.groupEnd()

console.group("Performance tests")
{
  console.group("JSON")
  json = `[${'{"a":1,"b":2}'.repeat(100)}]`
  await time(async () => {
    await source(json)
      .pipeThrough(new JsonDeserializer({ native: true }).transform())
      .pipeTo(terminate())
  })
  console.groupEnd()

  console.group("JSON Lines")
  json = '{"a":1,"b":2}\n'.repeat(100)
  await time(async () => {
    await source(json)
      .pipeThrough(new JsonDeserializer({ native: true, lineSeparated: true }).transform())
      .pipeTo(terminate())
  })
  console.groupEnd()
}
console.groupEnd()

console.log("Test completed.")