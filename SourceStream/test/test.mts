import { SourceStream } from "../SourceStream.mjs"

(async () => {

  const logger = () => new TransformStream({
    transform(chunk, controller) {
      console.log(chunk)
      controller.enqueue(chunk)
    }
  })

  const terminator = () => new WritableStream

  async function test<T>(data: T, strategy?: QueuingStrategy<T>) {
    console.groupCollapsed(`=== data: ${JSON.stringify(data)?.slice(0, 25)}, strategy: ${JSON.stringify(strategy)} ===`)

    await new SourceStream<T>(data, strategy)
      .pipeThrough(logger())
      .pipeTo(terminator())

    console.groupEnd()
  }

  await test(undefined)
  await test(null)
  await test("abc")
  await test(123)

  console.groupCollapsed("=== Array[object] ===")
  const arrayObject = [
    { a: 1 },
    { a: 1, b: 2 },
    { a: 1, b: 2, c: 3 },
  ]
  await test(arrayObject)
  console.groupEnd()

  console.groupCollapsed("=== Array[Array] ===")
  const arrayArray = [
    [1, 2, 3],
    [1, 2, 3, 4, 5, 6],
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ]
  await test(arrayArray)
  await test(arrayArray, { highWaterMark: 2 })
  await test(arrayArray, new CountQueuingStrategy({ highWaterMark: 2 }))
  console.groupEnd()

  console.groupCollapsed("=== Uint8Array ===")
  await test(new Uint8Array(8192 * 3 + 100))
  await test(new Uint8Array(8192 * 3 + 100), { highWaterMark: 8192 })
  await test(new Uint8Array(8192 * 3 + 100), new ByteLengthQueuingStrategy({ highWaterMark: 5000 }))
  console.groupEnd()

  console.groupCollapsed("=== Int32Array ===")
  await test(new Int32Array(8192 * 3 + 100))
  await test(new Int32Array(8192 * 3 + 100), { highWaterMark: 8192 })
  await test(new Int32Array(8192 * 3 + 100), new ByteLengthQueuingStrategy({ highWaterMark: 5000 }))
  console.groupEnd()

  console.log("Test completed.")

})()