import { ArrayAccumulatorStream } from "../ArrayAccumulatorStream.mjs"

(async () => {

  const readable = (data: any) => new ReadableStream({
    start(controller) {
      if (Array.isArray(data)) {
        for (const chunk of data) {
          controller.enqueue(chunk)
        }
      }
      else {
        controller.enqueue(data)
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

  const writable = () => new WritableStream

  const test = async (data: any, count: number) => {
    console.groupCollapsed(`=== data: ${JSON.stringify(data)}, count: ${count} ===`)
    await readable(data)
      .pipeThrough(new ArrayAccumulatorStream(count))
      .pipeThrough(logging())
      .pipeTo(writable())
    console.groupEnd()
  }

  await test(undefined, 2)
  await test(null, 2)
  await test("abc", 2)
  await test(123, 2)
  await test([1, 2, 3, 4, 5], 2)
  await test([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 },], 2)

  console.log("Test completed.")

})()