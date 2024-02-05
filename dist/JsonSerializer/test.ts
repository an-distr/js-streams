import { JsonSerializer } from "./JsonSerializer.ts"

const source = (data: any[]) => new ReadableStream({
  start(controller) {
    controller.enqueue(data)
    controller.close()
  }
})

const logging = () => new WritableStream({
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
await source(objs)
  .pipeThrough(new JsonSerializer().transform())
  .pipeTo(logging())

console.log("=== JSON Lines ===")
await source(objs)
  .pipeThrough(new JsonSerializer({ lineSeparated: true }).transform())
  .pipeTo(logging())

console.log("Test completed.")