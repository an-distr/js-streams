import { CsvDeserializer, CsvDeserializerOptions } from "./CsvDeserializer.ts"
import { SimplePerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.ts"
import { sleep } from "../funcs/sleep/sleep.ts"

const source = (source: string[]) => new ReadableStream({
  start(controller) {
    for (const line of source) {
      controller.enqueue(line + "\n")
    }
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

const deserializer = (options?: CsvDeserializerOptions) => new CsvDeserializer(options)

const csvHeaderLess = [
  "a,1,\"b,2\\\"\"",
  "c,3,d,4",
  "e,5,f\ng,6,h",
]
const csvHeaderIncluded = ["column1,column2,column3"].concat(csvHeaderLess)
const tsvHeaderLess = csvHeaderLess.map(x => x.replace(/,/g, "\t"))
const tsvHeaderIncluded = csvHeaderIncluded.map(x => x.replace(/,/g, "\t"))

const test = async (title: string, data: string[], headers?: string[], delimiter?: string) => {
  console.group(title)
  console.log("headers=", headers)
  console.log("data=", data)
  console.log("result=")
  await source(data)
    .pipeThrough(deserializer({
      hasHeader: !headers || headers.length === 0,
      headers,
      delimiter,
    }).transformable())
    .pipeThrough(logging())
    .pipeTo(terminate())
  console.groupEnd()
}

const testPerformance = async (columnCount: number, rowCount: number) => {
  console.group("columns=", columnCount, "rows=", rowCount)

  const rows: string[] = []
  const fields: string[] = []
  for (let i = 0; i < columnCount; ++i) {
    fields.push(`column${i + 1}`)
  }
  rows.push(fields.join(","))
  for (let i = 0; i < rowCount; ++i) {
    fields.length = 0
    for (let j = 0; j < columnCount; ++j) {
      fields.push(`value${i + 1}_${j + 1}`)
    }
    rows.push(fields.join(","))
  }

  const builder = new SimplePerformanceStreamBuilder()

  await source(rows)
    .pipeThrough(builder
      .pipe(deserializer({ hasHeader: true }).transformable())
      .build())
    .pipeTo(terminate())

  const perf = builder.result()
  console.table(perf)

  console.groupEnd()
}

console.group("Testing")
await test("CSV Header less", csvHeaderLess, ["c1", "c2"])
await test("CSV Header included", csvHeaderIncluded)
await test("TSV Header less", tsvHeaderLess, ["c1", "c2"], "\t")
await test("TSV Header included", tsvHeaderIncluded, undefined, "\t")
console.groupEnd()

await sleep()

console.group("Testing performance")
await testPerformance(100, 100000)
console.groupEnd()

console.log("Test completed.")