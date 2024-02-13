import { CsvLineEncoder } from "./CsvLineEncoder.ts"

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
  .pipeThrough(new CsvLineEncoder({ escape: "all" }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: auto ===")
await source(data)
  .pipeThrough(new CsvLineEncoder({ escape: "auto" }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: none ===")
await source(data)
  .pipeThrough(new CsvLineEncoder({ escape: "none" }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== escape: custom ===")
await source(data)
  .pipeThrough(new CsvLineEncoder({ escape: s => `[${s}]` }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== delimiter: custom ===")
await source(data)
  .pipeThrough(new CsvLineEncoder({ delimiter: "|" }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== newLine: custom ===")
await source(data)
  .pipeThrough(new CsvLineEncoder({ newLine: "|" }).transform())
  .pipeThrough(logging())
  .pipeTo(terminate())
console.groupEnd()

console.group("=== no new line ===")
let text = ""
await source(data)
  .pipeThrough(new CsvLineEncoder({ withNewLine: false }).transform())
  .pipeTo(new WritableStream({
    write(chunk) {
      text += chunk
    }
  }))
console.log(text)
console.groupEnd()

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
    .pipeThrough(new CsvLineEncoder().transform())
    .pipeTo(terminate())

  performance.mark("end")
  performance.measure("perf", "start", "end")
  const perf = performance.getEntriesByName("perf")[0]
  console.log("duration: ", perf.duration)
}
console.groupEnd()

console.log("\nTest completed.")