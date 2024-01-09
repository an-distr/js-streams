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

import { PushPull } from "../PushPull/PushPull.mjs"

export class ArrayAccumulator<I = any> extends PushPull<I, ArrayLike<I>> {
  private queue: I[] = []
  private size: number

  constructor(size: number, data?: ArrayLike<I> | Iterable<I> | I) {
    super()
    this.size = size;
    (async () => await this.push(data))()
  }

  async push(data?: ArrayLike<I> | Iterable<I> | AsyncIterable<I> | I) {
    if (data !== undefined) {
      if (typeof data === "function") {
        data = (await data())
      }
      if (data === null) {
        this.queue.push(data)
      }
      else if (Array.isArray(data)) {
        for (const value of data) this.queue.push(value)
      }
      else if (typeof data === "string") {
        this.queue.push(data)
      }
      else if (typeof (data as Iterable<I>)[Symbol.iterator] === "function") {
        for (const value of (data as Iterable<I>)) this.queue.push(value)
      }
      else if (typeof (data as AsyncIterable<I>)[Symbol.asyncIterator] === "function") {
        for await (const value of (data as AsyncIterable<I>)) this.queue.push(value)
      }
      else {
        this.queue.push(data as I)
      }
    }
    return this.queue.length
  }

  async *pushpull(data?: ArrayLike<I> | Iterable<I> | AsyncIterable<I> | I, pull?: boolean, flush?: boolean) {
    await this.push(data)

    if (pull) {
      while (this.queue.length >= this.size) {
        await this.push(yield this.queue.splice(0, this.size))
      }
    }

    if (pull && flush) {
      while (true) {
        while (this.queue.length >= this.size) {
          await this.push(yield this.queue.splice(0, this.size))
        }
        if (this.queue.length > 0) {
          if (await this.push(yield this.queue.splice(0)) > 0) {
            continue
          }
        }
        break
      }
    }
  }
}