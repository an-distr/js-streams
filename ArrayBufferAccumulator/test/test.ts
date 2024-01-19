import { ArrayBufferAccumulator } from "../ArrayBufferAccumulator.ts"
import { CompatiblePerformance } from "../../misc/CompatiblePerformance/CompatiblePerformance.ts"
import { Utf8DecoderStream, Utf8EncoderStream } from "../../Utf8Streams/Utf8Streams.ts"

(async () => {

  CompatiblePerformance.replaceIfUnsupported()

  function source(totalSize: number, chunkSize: number, isArray: boolean) {
    return new ReadableStream<Uint8Array | Array<number>>({
      start(controller) {
        const bytes = new ArrayBuffer(totalSize)
        const count = bytes.byteLength / chunkSize
        for (let i = 0; i < count; ++i) {
          const bytesView = new Uint8Array(bytes.slice(i * chunkSize, i * chunkSize + chunkSize))
          if (isArray) {
            const array = Array.from(bytesView.values())
            controller.enqueue(array)
          }
          else {
            controller.enqueue(bytesView)
          }
        }
        controller.close()
      }
    })
  }

  interface WritableResult {
    sizeOfWritten: number
  }

  function results<T extends ArrayBufferLike | ArrayLike<any>>(result: WritableResult) {
    return new WritableStream<T>({
      write(chunk) {
        if (Array.isArray(chunk)) {
          result.sizeOfWritten += chunk.length
        }
        else {
          result.sizeOfWritten += (chunk as ArrayBufferLike).byteLength
        }
      }
    })
  }

  function mark<T>(markName: string) {
    return new TransformStream<T, T>({
      transform(chunk, controller) {
        performance.mark(markName)
        controller.enqueue(chunk)
      }
    })
  }

  function measure<T>(measureName: string, startMark: string, endMark: string) {
    return new TransformStream<T, T>({
      transform(chunk, controller) {
        performance.measure(measureName, startMark, endMark)
        controller.enqueue(chunk)
      }
    })
  }

  function assertChunkSize<T extends ArrayBufferLike | ArrayLike<any>>(totalSize: number, chunkSize: number) {
    return new TransformStream<T, T>({
      transform(chunk, controller) {
        let length: number
        if (Array.isArray(chunk)) {
          length = chunk.length
        }
        else {
          length = (chunk as ArrayBufferLike).byteLength
        }
        console.assert([
          totalSize,
          chunkSize,
          totalSize - (chunkSize * Math.floor(totalSize / chunkSize)),
        ].indexOf(length) !== -1, {
          receivedChunkSize: length,
        })
        controller.enqueue(chunk)
      }
    })
  }

  const test = async (totalSize: number, readableChunkSize: number, chunkSize: number, fixed: boolean, isArray: boolean) => {
    readableChunkSize = readableChunkSize === 0 ? totalSize : readableChunkSize

    performance.clearMeasures("ArrayBufferAccumulator.transform")
    performance.clearMarks("start")
    performance.clearMarks("end")

    const result: WritableResult = { sizeOfWritten: 0 }

    await source(totalSize, readableChunkSize, isArray)
      .pipeThrough(mark("start"))
      .pipeThrough(new ArrayBufferAccumulator(chunkSize, { fixed }).transform())
      .pipeThrough(mark("end"))
      .pipeThrough(assertChunkSize(totalSize, chunkSize))
      .pipeThrough(measure("ArrayBufferAccumulator.transform", "start", "end"))
      .pipeThrough(mark("start"))
      .pipeTo(results(result))

    const entries = performance.getEntriesByName("ArrayBufferAccumulator.transform")
    const durations = entries.map(e => e.duration)
    const totalDuration = durations.reduce((s, d) => s += d, 0.0)
    const minDuration = durations.reduce((l, r) => Math.min(l, r))
    const maxDuration = durations.reduce((l, r) => Math.max(l, r))
    const sortedDurations = [...new Set(durations.sort((l, r) => l - r))]
    const medianDurationIndex = sortedDurations.length / 2 | 0
    const medianDuration = sortedDurations.length === 0
      ? 0
      : sortedDurations.length % 2
        ? sortedDurations[medianDurationIndex]
        : sortedDurations[medianDurationIndex - 1] + sortedDurations[medianDurationIndex]

    console.groupCollapsed([
      `ReadableStream(${totalSize.toLocaleString()}, { isArray: ${isArray} }) =>`,
      `chunk(${readableChunkSize.toLocaleString()}) =>`,
      `ArrayBufferAccumulator(${chunkSize.toLocaleString()}, { fixed: ${fixed} })`,
      `durationOfOccupancy: ${totalDuration}`,
    ].join(" "))
  
    console.assert((fixed
      ? chunkSize * Math.ceil(totalSize / chunkSize)
      : totalSize) === result.sizeOfWritten, {
      sizeOfWritten: result.sizeOfWritten,
    })
    
    console.table({
      totalSize,
      readableChunkSize,
      chunkSize,
      sizeOfWritten: result.sizeOfWritten,
      transforming: entries.length,
      durationOfOccupancy: totalDuration,
      durationMinimum: minDuration,
      durationMaximum: maxDuration,
      durationAverage: totalDuration / entries.length,
      durationMedian: medianDuration,
    })

    console.groupEnd()
  }

  const testNewLine = async (chunkSize: number) => {
    const text = "aaaaaaaaaa\nbbbbbbbbbb\ncccccccccc\ndddddddddd\neeeeeeeeee\n11111"

    const readable = new ReadableStream<string>({
      start(controller) {
        controller.enqueue(text)
        controller.close()
      }
    })

    const writable = new WritableStream({
      write(chunk) {
        console.log(`[${chunk}]`)
      }
    })

    await readable
      .pipeThrough(new Utf8EncoderStream)
      .pipeThrough(new ArrayBufferAccumulator(chunkSize, { forceEmit: [[10, 13], [13], [10]] }).transform())
      .pipeThrough(new Utf8DecoderStream)
      .pipeTo(writable)
  }

  // warmup
  await source(1, 1, false)
    .pipeThrough(new ArrayBufferAccumulator(1).transform())
    .pipeTo(new WritableStream)

  const totalSizes = [
    1,
    1000,
    1 * 1024 * 1024,
  ]
  const readableChunkSizes = [
    64,
    1000,
    8192,
    8192 * 10,
    0,
  ]
  const chunkSizes = [
    128,
    256,
    512,
    1000,
    8192,
  ]

  console.groupCollapsed("Testing ArrayBuffer|Array")
  for (const totalSize of totalSizes) {
    console.groupCollapsed(`totalSize: ${totalSize}`)
    for (const readableChunkSize of readableChunkSizes) {
      for (const chunkSize of chunkSizes) {
        for (const fixed of [false, true]) {
          for (const isArray of [false, true]) {
            await test(totalSize, readableChunkSize, chunkSize, fixed, isArray)
          }
        }
      }
    }
    console.groupEnd()
  }
  console.groupEnd()

  console.groupCollapsed("Testing line separate")
  console.groupCollapsed("> size")
  await testNewLine(8)
  console.groupEnd()
  console.groupCollapsed("= size")
  await testNewLine(10)
  console.groupEnd()
  console.groupCollapsed("< size")
  await testNewLine(13)
  console.groupEnd()
  console.groupEnd()

  console.log("Test completed.")

})()