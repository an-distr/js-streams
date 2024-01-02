# ArrayAccumulatorStream

## Description
Accumulate the stream and emit it at a constant size array.

**If you can set a "[highWaterMark](https://developer.mozilla.org/en-US/docs/Web/API/CountQueuingStrategy/highWaterMark)" for "[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)", it is more efficient.**

## Stream type
* [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)

## Input/output definition
|Direction|Type|
|-|-|
|Input|ArrayLike<any> \| any|
|Output|ArrayLike<any>|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { ArrayAccumulatorStream } from "https://an-js-streams.pages.dev/mod.mjs"

const accumulator = new ArrayAccumulatorStream(
  // Specify queueing chunk count.
  512
)

await readable
  .pipeThrough(accumulator)
  .pipeTo(writable)
```