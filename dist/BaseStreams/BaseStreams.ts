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

import { PullPush, PullPushNonQueue, PullPushTypes } from "../PullPush/PullPush.ts"

export type BaseType =
  "base16" |
  "base32" |
  "base32hex" |
  "base64" |
  "base64url" |
  string

const MAP_BASE16 = "0123456789ABCDEF"
const MAP_BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const MAP_BASE32_HEX = "0123456789ABCDEFGHIJKLMNOPQRSTUV"
const MAP_BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
const MAP_BASE64_URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"

export interface BaseContext {
  bitsPerByte: number
  map: string
  bitSpan: number
  blockSize: number
  padding: boolean
  paddingChar: string
}

function createContext(base?: BaseType) {
  const context = {} as BaseContext
  context.bitsPerByte = 8
  context.padding = true
  context.paddingChar = "="

  base ??= "base64"
  base = base.toLowerCase()

  switch (base) {
    case "base16":
      context.map = MAP_BASE16;
      context.bitSpan = 4;
      context.blockSize = 1;
      break;

    case "base32":
    case "base32hex":
      context.map = base === "base32hex" ? MAP_BASE32_HEX : MAP_BASE32;
      context.bitSpan = 5;
      context.blockSize = 8;
      break;

    case "base64":
    case "base64url":
      context.map = base === "base64url" ? MAP_BASE64_URL : MAP_BASE64;
      context.bitSpan = 6;
      context.blockSize = 4;
      break;

    default:
      throw new Error("Unsupported")
  }

  return context
}

export class BaseEncoder extends PullPush<number, string, PullPushNonQueue<number, string>> {
  private context: BaseContext
  private inputBuffer: number[] = []
  private outputBuffer: string[] = []

  constructor(base?: BaseType)
  constructor(context?: BaseContext)
  constructor(arg?: BaseType | BaseContext) {
    super(new PullPushNonQueue)
    if (typeof arg === "string") {
      this.context = createContext(arg)
    }
    else {
      this.context = arg ?? createContext()
    }
  }

  override async push(data?: PullPushTypes<number>) {
    if (!data) {
      return
    }

    let bytes: number[]
    if (typeof data === "number") {
      bytes = [data]
    }
    else if (typeof (data as Iterable<number>)[Symbol.iterator] === "function") {
      bytes = Array.from(data as Iterable<number>)
    }
    else if (typeof (data as AsyncIterable<number>)[Symbol.asyncIterator] === "function") {
      bytes = []
      for await (const value of data as AsyncIterable<number>) {
        bytes.push(value)
      }
    }
    else {
      bytes = Array.from(new Uint8Array(data as ArrayBufferLike))
    }

    for (const b of bytes) {
      for (const n of b.toString(2).padStart(this.context.bitsPerByte, "0")) {
        this.inputBuffer.push(n === "0" ? 0 : 1)
      }
    }
  }

  async *pullpush(data?: PullPushTypes<number>, flush?: boolean) {
    await this.push(data)

    do {
      while (this.inputBuffer.length >= this.context.bitSpan) {
        const bits = parseInt(this.inputBuffer.splice(0, this.context.bitSpan).join(""), 2)
        this.outputBuffer.push(this.context.map[bits])
      }

      if (this.outputBuffer.length >= this.context.blockSize) {
        const chunk = this.outputBuffer.splice(0,
          this.context.blockSize * Math.floor(this.outputBuffer.length / this.context.blockSize))
          .join("")
        const next: PullPushTypes<number> = yield chunk
        await this.push(next)
      }

      if (flush) {
        if (this.inputBuffer.length > 0) {
          const bits = parseInt(this.inputBuffer.splice(0, this.context.bitSpan).join("").padEnd(this.context.bitSpan, "0"), 2)
          this.outputBuffer.push(this.context.map[bits])
          let chunk = this.outputBuffer.splice(0, this.context.blockSize).join("")
          if (this.context.padding) {
            chunk = chunk.padEnd(this.context.blockSize, this.context.paddingChar)
          }
          const next: PullPushTypes<number> = yield chunk
          await this.push(next)
        }
      }
      else {
        break
      }
    } while (this.inputBuffer.length > 0)
  }
}

export class BaseDecoder extends PullPush<string, Uint8Array, PullPushNonQueue<string, Uint8Array>> {
  private context: BaseContext
  private inputBuffer: number[] = []
  private outputBuffer: number[] = []

  constructor(base?: BaseType)
  constructor(context?: BaseContext)
  constructor(arg?: BaseType | BaseContext) {
    super(new PullPushNonQueue)
    if (typeof arg === "string") {
      this.context = createContext(arg)
    }
    else {
      this.context = arg ?? createContext()
    }
  }

  override async push(data?: PullPushTypes<string>) {
    if (!data) {
      return
    }

    let strarr: string[]
    if (Array.isArray(data)) {
      strarr = data
    }
    else {
      strarr = Array.from(data as Iterable<string>)
    }

    for (const s of strarr) {
      for (const c of s) {
        if (c === this.context.paddingChar) {
          continue
        }
        const index = this.context.map.indexOf(c)
        if (index < 0) {
          throw new Error(`Invalid character '${c}'`)
        }
        for (const n of index.toString(2).padStart(this.context.bitSpan, "0")) {
          this.inputBuffer.push(n === "0" ? 0 : 1)
        }
      }
    }
  }

  async *pullpush(data?: PullPushTypes<string>, flush?: boolean) {
    await this.push(data)

    do {
      while (this.inputBuffer.length >= this.context.bitsPerByte) {
        const byte = this.inputBuffer.splice(0, this.context.bitsPerByte).join("")
        this.outputBuffer.push(parseInt(byte, 2))
      }

      if (this.outputBuffer.length > 0) {
        const next: PullPushTypes<string> = yield new Uint8Array(this.outputBuffer)
        this.outputBuffer.length = 0
        await this.push(next)
      }

      if (flush) {
        this.inputBuffer.length = 0
        this.outputBuffer.length = 0
      }
      else {
        break
      }
    } while (this.inputBuffer.length > 0)
  }
}