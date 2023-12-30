import { PeekStream } from "../PeekStream.mjs"

function readable() {
  return new ReadableStream<ArrayBuffer>({
    start(controller) {
      controller.enqueue(Uint8Array.from([1, 2, 3]))
      controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6]))
      controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]))
      controller.close()
    }
  })
}

(async () => {
  await readable()
    .pipeThrough(new PeekStream((chunk, index) => console.log(`${index}: size=${chunk.byteLength}`)))
    .pipeTo(new WritableStream)

  console.log("Test completed.")
})()