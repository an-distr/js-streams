import { NullStream } from "../NullStream.mjs"

(async () => {

  const readable = () => new ReadableStream({
    start(controller) {
      controller.enqueue([1, 2, 3])
      console.log("controller.enqueue([1, 2, 3])")
      
      controller.enqueue([1, 2, 3, 4, 5, 6])
      console.log("controller.enqueue([1, 2, 3, 4, 5, 6])")

      controller.enqueue([1, 2, 3, 4, 5, 6, 7, 8, 9])
      console.log("controller.enqueue([1, 2, 3, 4, 5, 6, 7, 8, 9])")

      controller.close()
      console.log("controller.close()")
    }
  })

  await readable()
    .pipeTo(new NullStream)

  console.log("Test completed.")

})()