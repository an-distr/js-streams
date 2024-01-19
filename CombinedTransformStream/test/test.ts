import { CombinedTransformStream } from "../CombinedTransformStream.ts"

(async () => {

  const source = () => new ReadableStream({
    start(controller) {
      for (const n of [1, 2, 3, 4, 5]) {
        controller.enqueue(n)
      }
      controller.close()
    }
  })

  const terminate = () => new WritableStream({
    write(chunk) {
      console.log(`writed: ${chunk}`)
      console.groupEnd()
    }
  })

  const grouping = () => new TransformStream({
    transform(chunk, controller) {
      console.group(`chunk=${chunk}`)
      controller.enqueue(chunk)
    }
  })

  const transform = (name: string) => new TransformStream({
    transform(chunk, controller) {
      console.log(`chunk=${chunk}, name=${name}`)
      controller.enqueue(chunk)
    }
  })

  await source()
    .pipeThrough(grouping())
    .pipeThrough(new CombinedTransformStream([
      transform("transform 1"),
      transform("transform 2"),
      transform("transform 3"),
    ]))
    .pipeTo(terminate())

})()