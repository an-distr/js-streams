# AccumuratorStream

## Description
Accumulate the stream and emit it at a constant size or condition.

## Input/output definition
|Direction|Type|
|-|-|
|Input|ArrayBufferLike|
|Output|ArrayBufferLike|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { AccumulatorStream } from "https://an-js-streams.pages.dev/mod.mjs"

const accumulator = new AccumulatorStream(
  // Specify emit size.
  512,
  // The options.
  {
    // Specify the conditions for forced emit.
    forceEmit: number[][] // Specifies the bytes patterns to be conditioned. For example, character codes.
               | (bytes: IterableIterator<number>) => number // Or describe the detailed processing. Returns the position to be divided.
    // If true, the final output size is the same as the emit size. If you specify false, the last output is the size that remains. The initial value is false. If specify "forceEmit" parameter, always false.
    fixed: false,
  })

await readable
  .pipeThrough(accumulator)
  .pipeTo(writable)
```
**Sequence**
```
Readable(chunk: 1100)
  => Accumulator(size: 512)
    => (chunk: 512)
    => (chunk: 512)
    => (chunk: 76) // If true specified for "fixed", emit size of 512.
  => Writable

Readable(chunk: 100)
  => Accumulator(size: 512)
    => (chunk: 100) // If true specified for "fixed", emit size of 512.
  => Writable
```