import { AssertStream } from "./AssertStream.ts"

const source = (data: any) => new ReadableStream({
  start(controller) {
    controller.enqueue(data)
    controller.close()
  }
})

const terminate = () => new WritableStream

await source([1, 2, 3, 4, 5])
  .pipeThrough(new AssertStream(chunk => chunk <= 4))
  .pipeTo(terminate())

console.log("Test completed.")