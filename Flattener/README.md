# FlattenStream

## Description
Flatten the stream.

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
import { FlattenStream } from "https://an-js-streams.pages.dev/mod.mjs"

const flatten = new FlattenStream({
  // Specify flatten limit.
  -1
})

await readable
  .pipeThrough(flatten)
  .pipeTo(writable)
```