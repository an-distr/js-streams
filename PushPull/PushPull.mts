/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

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

export type PushableTypes<T> = ArrayBufferLike | ArrayLike<T> | Iterable<T> | AsyncIterable<T> | T

export interface PushPullQueue<T, All> {
  length(): number
  more(): boolean
  all(): All
  push(data: T): void
  pop(): T | undefined
  empty(): void
  splice(start: number, deleteCount?: number): All
}

export class PushPullArrayBufferQueue implements PushPullQueue<ArrayBufferLike, ArrayBufferLike> {
  private queue: ArrayBuffer
  private size: number
  private pos: number

  constructor(size: number) {
    this.size = size
    this.queue = new ArrayBuffer(this.size)
    this.pos = 0
  }

  length() {
    return this.pos
  }

  more() {
    return this.pos > 0
  }

  all() {
    return this.queue.slice(0, this.pos)
  }

  push(data: ArrayBuffer) {
    const queueView = new Uint8Array(this.queue)
    const dataView = new Uint8Array(data)
    let chunkSize = data.byteLength
    let chunkPos = 0
    while (chunkSize > 0) {
      const copySize = Math.min(this.size - this.pos, chunkSize)
      queueView.set(dataView.slice(chunkPos, chunkPos + copySize), this.pos)
      this.pos += copySize
      chunkPos += copySize
      chunkSize -= copySize
    }
  }

  pop() {
    return this.splice(-1)
  }

  empty() {
    this.queue = new ArrayBuffer(this.size)
    this.pos = 0
  }

  splice(start: number, deleteCount?: number) {
    const view = new Uint8Array(this.queue)
    const shiftSize = deleteCount === undefined ? this.size : start + deleteCount
    const data = view.slice(start, shiftSize)
    view.set(view.slice(shiftSize), start)
    this.pos -= shiftSize
    return data
  }
}

export class PushPullArrayQueue<T = any> implements PushPullQueue<T, ArrayLike<T>> {
  private queue: T[] = []

  length() {
    return this.queue.length
  }

  more() {
    return this.queue.length > 0
  }

  all() {
    return this.queue
  }

  push(data: T) {
    this.queue.push(data)
  }

  pop() {
    return this.queue.pop()
  }

  empty() {
    this.queue.splice(0)
  }

  splice(start: number, deleteCount?: number) {
    if (deleteCount) {
      return this.queue.splice(start, deleteCount)
    }
    else {
      return this.queue.splice(start)
    }
  }
}

export class PushPullStringQueue implements PushPullQueue<string, string> {
  private queue: string = ""

  length() {
    return this.queue.length
  }

  more() {
    return this.queue.length > 0
  }

  all() {
    return this.queue
  }

  push(data: string) {
    this.queue += data
  }

  pop() {
    return this.splice(-1)
  }

  empty() {
    this.queue = ""
  }

  splice(start: number, deleteCount?: number) {
    if (deleteCount) {
      const value = this.queue.slice(start, start + deleteCount)
      this.queue = this.queue.slice(0, start) + this.queue.slice(start + deleteCount)
      return value
    }
    else {
      const value = this.queue.slice(start)
      this.queue = this.queue.slice(0, start)
      return value
    }
  }
}

export abstract class PushPull<I = any, O = any, Q extends PushPullQueue<I, any> = PushPullArrayQueue<I>> implements AsyncIterable<O> {
  protected queue: Q

  constructor(queue: Q) {
    this.queue = queue
  }

  abstract pushpull(data?: PushableTypes<I>, flush?: boolean): AsyncGenerator<O>

  async push(data?: PushableTypes<I>) {
    if (data !== undefined) {
      if (typeof data === "function") {
        data = (await data())
      }
      if (data === null) {
        this.queue.push(data)
      }
      else if (typeof data === "string") {
        this.queue.push(data)
      }
      else if (Array.isArray(data)) {
        for (const value of data) this.queue.push(value)
      }
      else if (typeof (data as Iterable<I>)[Symbol.iterator] === "function") {
        for (const value of data as Iterable<I>) this.queue.push(value)
      }
      else if (typeof (data as AsyncIterable<I>)[Symbol.asyncIterator] === "function") {
        for await (const value of data as AsyncIterable<I>) this.queue.push(value)
      }
      else {
        this.queue.push(data as I)
      }
    }
  }

  pull(data?: PushableTypes<I>) {
    return this.pushpull(data)
  }

  flush(data?: PushableTypes<I>) {
    return this.pushpull(data, true)
  }

  [Symbol.asyncIterator]() {
    return this.flush()
  }

  readable(data?: PushableTypes<I>) {
    const This = this
    return new ReadableStream<O>({
      async start(controller) {
        for await (const chunk of This.flush(data)) {
          controller.enqueue(chunk)
        }
        controller.close()
      }
    })
  }

  transform() {
    const This = this
    return new TransformStream<I, O>({
      async transform(data, controller) {
        for await (const chunk of This.pull(data)) {
          controller.enqueue(chunk)
        }
      },
      async flush(controller) {
        for await (const chunk of This.flush()) {
          controller.enqueue(chunk)
        }
      }
    })
  }

  writable() {
    const This = this
    return new WritableStream<I>({
      async write(data) {
        await This.push(data)
      }
    })
  }
}