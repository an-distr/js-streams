# PeekStream

## Description
Peeking chunk of stream.

## Input/output definition
|Direction|Type|
|-|-|
|Input|any|
|Output|any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { PeekStream } from "https://an-js-streams.pages.dev/mod.mjs"

await readable
  // Peeking chunk.
  .pipeThrough(new PeekStream((chunk) => console.log(chunk)))
  // Peeking chunk with index.
  .pipeThrough(new PeekStream((chunk, index) => console.log(`${index}: ${chunk}`)))
  .pipeTo(writable)
```