import { NullStream } from "../NullStream.mjs"

function readable() {
  return new ReadableStream<ArrayBuffer>({
    start(controller) {
      controller.enqueue(Uint8Array.from([1, 2, 3]))
      console.log("controller.enqueue(Uint8Array.from([1, 2, 3]))")
      controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6]))
      console.log("controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6]))")
      controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]))
      console.log("controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]))")
      controller.close()
      console.log("controller.close()")
    }
  })
}

(async () => {
  await readable()
    .pipeTo(new NullStream)

  console.log("Test completed.")
})()