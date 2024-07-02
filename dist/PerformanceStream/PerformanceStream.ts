/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-distr)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import { CombinedTransformStream } from "../CombinedTransformStream/CombinedTransformStream.ts"

export interface PerformanceStreamResult {
  transforming: number
  occupancy: number
  minimum: number
  maximum: number
  average: number
  median: number
}

export class PerformanceStreamBuilder<I = any, O = any> {
  private transforms: TransformStream[] = []
  private measureName: string
  private startMark: string
  private endMark: string
  private entries?: PerformanceEntryList

  constructor(measureName: string, startMark: string, endMark: string) {
    this.measureName = measureName
    this.startMark = startMark
    this.endMark = endMark
  }

  pipe(transform: TransformStream) {
    this.transforms.push(transform)
    return this
  }

  build(options?: StreamPipeOptions): TransformStream<I, O> {
    const This = this

    const first = new TransformStream<I, I>({
      start() {
        performance.clearMeasures(This.measureName)
        performance.clearMarks(`${This.measureName}.${This.startMark}`)
        performance.clearMarks(`${This.measureName}.${This.endMark}`)
      },
      transform(chunk, controller) {
        performance.mark(`${This.measureName}.${This.startMark}`)
        controller.enqueue(chunk)
      }
    })

    const last = new TransformStream<O, O>({
      transform(chunk, controller) {
        performance.mark(`${This.measureName}.${This.endMark}`)
        performance.measure(This.measureName, `${This.measureName}.${This.startMark}`, `${This.measureName}.${This.endMark}`)
        performance.mark(`${This.measureName}.${This.startMark}`)
        controller.enqueue(chunk)
      },
      flush() {
        This.entries = performance.getEntriesByName(This.measureName)
        performance.clearMeasures(This.measureName)
        performance.clearMarks(`${This.measureName}.${This.startMark}`)
        performance.clearMarks(`${This.measureName}.${This.endMark}`)
      }
    })

    const combined = new CombinedTransformStream<I, O>(this.transforms, options)
    this.transforms.splice(0)

    first.readable.pipeTo(combined.writable, options)
    combined.readable.pipeTo(last.writable, options)

    return {
      writable: first.writable,
      readable: last.readable,
    }
  }

  result(): PerformanceStreamResult | undefined {
    if (!this.entries || this.entries.length === 0) return undefined

    const durations = this.entries.map(e => e.duration)
    if (durations.length === 0) {
      return {
        transforming: 0,
        occupancy: 0,
        minimum: 0,
        maximum: 0,
        average: 0,
        median: 0,
      }
    }

    const occupancy = durations.reduce((s, d) => s += d, 0.0)
    const minimum = durations.reduce((l, r) => Math.min(l, r))
    const maximum = durations.reduce((l, r) => Math.max(l, r))
    const sorted = [...new Set(durations.sort((l, r) => l - r))]
    const medianIndex = sorted.length / 2 | 0
    const median = sorted.length === 0
      ? 0
      : sorted.length % 2
        ? sorted[medianIndex]
        : sorted[medianIndex - 1] + sorted[medianIndex]

    return {
      transforming: durations.length,
      occupancy: occupancy,
      minimum: minimum,
      maximum: maximum,
      average: occupancy / durations.length,
      median: median,
    }
  }
}

export class SimplePerformanceStreamBuilder<I = any, O = any> {
  private transforms: TransformStream[] = []
  private point: number = 0
  private durations: number[] = []

  pipe(transform: TransformStream) {
    this.transforms.push(transform)
    return this
  }

  build(options?: StreamPipeOptions): TransformStream<I, O> {
    const This = this

    const first = new TransformStream<I, I>({
      transform(chunk, controller) {
        This.point = performance.now()
        controller.enqueue(chunk)
      }
    })

    const last = new TransformStream<O, O>({
      transform(chunk, controller) {
        const now = performance.now()
        This.durations.push(now - This.point)
        This.point = now
        controller.enqueue(chunk)
      },
      flush() {
        This.durations.push(performance.now() - This.point)
      }
    })

    const combined = new CombinedTransformStream<I, O>(this.transforms, options)
    this.transforms.splice(0)

    first.readable.pipeTo(combined.writable, options)
    combined.readable.pipeTo(last.writable, options)

    return {
      writable: first.writable,
      readable: last.readable,
    }
  }

  result(): PerformanceStreamResult | undefined {
    if (!this.durations || this.durations.length === 0) return undefined

    if (this.durations.length === 0) {
      return {
        transforming: 0,
        occupancy: 0,
        minimum: 0,
        maximum: 0,
        average: 0,
        median: 0,
      }
    }

    const occupancy = this.durations.reduce((s, d) => s += d, 0.0)
    const minimum = this.durations.reduce((l, r) => Math.min(l, r))
    const maximum = this.durations.reduce((l, r) => Math.max(l, r))
    const sorted = [...new Set(this.durations.sort((l, r) => l - r))]
    const medianIndex = sorted.length / 2 | 0
    const median = sorted.length === 0
      ? 0
      : sorted.length % 2
        ? sorted[medianIndex]
        : sorted[medianIndex - 1] + sorted[medianIndex]

    return {
      transforming: this.durations.length,
      occupancy: occupancy,
      minimum: minimum,
      maximum: maximum,
      average: occupancy / this.durations.length,
      median: median,
    }
  }
}