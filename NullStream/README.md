# NullStream

## Description
Read through the stream and terminate it.

## Stream type
* [WritableStream](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)

## Input/output definition
|Direction|Type|
|-|-|
|Input|any|
|Output|none|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { NullStream } from "https://an-js-streams.pages.dev/mod.mjs"

await readable
  .pipeTo(new NullStream)
```