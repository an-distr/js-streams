import { CsvSerializer } from "./CsvSerializer.ts"
import { sleep } from "../funcs/sleep/sleep.ts"

const source = (data: any[]) => new ReadableStream({
  start(controller) {
    controller.enqueue(data)
    controller.close()
  }
})

const logging = () => new TransformStream({
  transform(chunk, controller) {
    console.log(chunk)
    controller.enqueue(chunk)
  }
})

const terminate = () => new WritableStream()

const data = [
  { "a": 1, "b": 2, "c": "aaa\nbbb,ccc" },
  { "a": 4, "b": 5, "c": 6 },
  { "a": 7, "b": 8, "c": 9 },
  { "c1": "a", "c2": "b", "c3": "c", "c4": "d" },
]

console.group("=== escape: all ===")
await source(data)
  .pipeThrough(new CsvSerializer({ escape: "all" }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: auto ===")
await source(data)
  .pipeThrough(new CsvSerializer({ escape: "auto" }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: none ===")
await source(data)
  .pipeThrough(new CsvSerializer({ escape: "none" }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: custom ===")
await source(data)
  .pipeThrough(new CsvSerializer({ escape: s => `[${s}]` }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== delimiter: custom ===")
await source(data)
  .pipeThrough(new CsvSerializer({ delimiter: "|" }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== newLine: custom ===")
await source(data)
  .pipeThrough(new CsvSerializer({ newLine: "|" }).transformable())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== no new line ===")
let text = ""
await source(data)
  .pipeThrough(new CsvSerializer({ withNewLine: false }).transformable())
  .pipeTo(new WritableStream({
    write(chunk) {
      text += chunk
    }
  }))
console.log(text)
console.groupEnd()

await sleep()

console.group("Performance test")
{
  const count = 100000
  console.log("count", count)

  const array = []
  for (let i = 0; i < count; ++i) {
    array.push(`{ "a": ${i + 1}, "b": ${i + 2}, "c": "aaa\nbbb,ccc" }`)
  }

  performance.mark("start")

  await source(array)
    .pipeThrough(new CsvSerializer().transformable())
    .pipeTo(terminate())

  performance.mark("end")
  performance.measure("perf", "start", "end")
  const perf = performance.getEntriesByName("perf")[0]
  console.log("duration: ", perf.duration)
}
console.groupEnd()

console.log("\nTest completed.")