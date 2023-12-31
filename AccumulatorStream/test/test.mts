import { AccumulatorStream } from "../AccumulatorStream.mjs"
import { CompatiblePerformance } from "../../misc/CompatiblePerformance/CompatiblePerformance.mjs"
import { Utf8DecoderStream, Utf8EncoderStream } from "../../Utf8Streams/Utf8Streams.mjs"

if (
  !("now" in performance) ||
  !("mark" in performance) ||
  !("measure" in performance) ||
  !("getEntries" in performance) ||
  !("getEntriesByType" in performance) ||
  !("getEntriesByName" in performance) ||
  !("clearMeasures" in performance) ||
  !("clearMarks" in performance)
) {
  console.warn("globalThis.performance switch to CompatiblePerformance")
  performance = new CompatiblePerformance
}

(async () => {

  function readable(totalSize: number, chunkSize: number, isArray: boolean) {
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

  function writable<T extends ArrayBufferLike | ArrayLike<any>>(result: WritableResult) {
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

    console.group([
      `run: `,
      `ReadableStream(${totalSize.toLocaleString()}, { isArray: ${isArray} }) =>`,
      `chunk(${readableChunkSize.toLocaleString()}) =>`,
      `AccumulatorStream(${chunkSize.toLocaleString()}, { fixed: ${fixed} })`,
    ].join(" "))

    performance.clearMeasures("AccumulatorStream.transform")
    performance.clearMarks("start")
    performance.clearMarks("end")

    const result: WritableResult = { sizeOfWritten: 0 }

    await readable(totalSize, readableChunkSize, isArray)
      .pipeThrough(mark("start"))
      .pipeThrough(new AccumulatorStream(chunkSize, { fixed }))
      .pipeThrough(mark("end"))
      .pipeThrough(assertChunkSize(totalSize, chunkSize))
      .pipeThrough(measure("AccumulatorStream.transform", "start", "end"))
      .pipeThrough(mark("start"))
      .pipeTo(writable(result))

    console.assert((fixed
      ? chunkSize * Math.ceil(totalSize / chunkSize)
      : totalSize) === result.sizeOfWritten, {
      sizeOfWritten: result.sizeOfWritten,
    })

    const entries = performance.getEntriesByName("AccumulatorStream.transform")
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
      .pipeThrough(new AccumulatorStream(chunkSize, { forceEmit: [[10, 13], [13], [10]] }))
      .pipeThrough(new Utf8DecoderStream)
      .pipeTo(writable)
  }

  // warmup
  await readable(1, 1, false)
    .pipeThrough(new AccumulatorStream(1))
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

  for (const totalSize of totalSizes) {
    for (const readableChunkSize of readableChunkSizes) {
      for (const chunkSize of chunkSizes) {
        for (const fixed of [false, true]) {
          for (const isArray of [false, true]) {
            await test(totalSize, readableChunkSize, chunkSize, fixed, isArray)
          }
        }
      }
    }
  }

  console.log("Testing line separate(> size)")
  await testNewLine(8)
  console.log("Testing line separate(= size)")
  await testNewLine(10)
  console.log("Testing line separate(< size)")
  await testNewLine(13)

  console.log("Test completed.")

})()