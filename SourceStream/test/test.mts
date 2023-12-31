import { SourceStream } from "../SourceStream.mjs"

(async () => {

  const logger = () => new TransformStream({
    transform(chunk, controller) {
      console.log(chunk)
      controller.enqueue(chunk)
    }
  })

  const terminator = () => new WritableStream

  async function test<T>(data: T) {
    console.log(`=== data: ${JSON.stringify(data)} ===`)
    await new SourceStream<T>(data)
      .pipeThrough(logger())
      .pipeTo(terminator())
  }

  await test(undefined)
  await test(null)
  await test("abc")
  await test(123)

  await test([
    { a: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 2, c: 3 },
  ])

  await test([
    [1, 2, 3],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ])

  await test(new Uint8Array(8192 * 3 + 100))

  console.log("Test completed.")

})()