# SourceStream

## Description
Streaming for object(s).

## Stream type
* [ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

## Input/output definition
|Direction|Type|
|-|-|
|Output|ArrayBufferLike \| ArrayLike \| any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { SourceStream } from "https://an-js-streams.pages.dev/mod.mjs"

const data = [
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
  { a: 1, b: 2, c: 3 },
]

await new SourceStream(data)
  .pipeTo(writable)
```