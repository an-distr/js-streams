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

export type PullPushTypes<T> = ArrayBufferLike | ArrayLike<T> | Iterable<T> | AsyncIterable<T> | T

export interface PullPushQueue<T, All> {
  length(): number
  more(): boolean
  all(): All
  push(data: T): void
  shift(): T |undefined
  pop(): T | undefined
  empty(): void
  splice(start: number, deleteCount?: number): All
}

export class PullPushNonQueue<I, O> implements PullPushQueue<I, O> {
  length() {
    return 0
  }

  more() {
    return true
  }

  all(): O {
    throw new Error("Method not implemented.")
  }

  push(_data: I) {
  }

  shift() {
    return undefined
  }

  pop() {
    return undefined
  }

  empty() {
  }

  splice(_start: number, _deleteCount?: number): O {
    throw new Error("Method not implemented.")
  }
}

export class PullPushArrayQueue<T = any> implements PullPushQueue<T, ArrayLike<T>> {
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

  shift() {
    return this.queue.shift()
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

export class PullPushStringQueue implements PullPushQueue<string, string> {
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

  shift() {
    return this.splice(0, 1)
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

export abstract class PullPush<I = any, O = any, Q extends PullPushQueue<I, any> = PullPushArrayQueue<I>> implements AsyncIterable<O> {
  protected queue: Q

  constructor(queue: Q) {
    this.queue = queue
  }

  abstract pullpush(data?: PullPushTypes<I>, flush?: boolean): AsyncGenerator<O>

  async push(data?: PullPushTypes<I>) {
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
        for (const value of data) {
          this.queue.push(value)
        }
      }
      else if (typeof (data as Iterable<I>)[Symbol.iterator] === "function") {
        for (const value of data as Iterable<I>) {
          this.queue.push(value)
        }
      }
      else if (typeof (data as AsyncIterable<I>)[Symbol.asyncIterator] === "function") {
        for await (const value of data as AsyncIterable<I>) {
          this.queue.push(value)
        }
      }
      else {
        this.queue.push(data as I)
      }
    }
  }

  pull(data?: PullPushTypes<I>) {
    return this.pullpush(data)
  }

  flush(data?: PullPushTypes<I>) {
    return this.pullpush(data, true)
  }

  [Symbol.asyncIterator]() {
    return this.flush()
  }

  readable(data?: PullPushTypes<I>) {
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

  transformable() {
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