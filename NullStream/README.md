# NullStream

## Description
Read through the stream and terminate it.

## Input/output definition
|Direction|Type|
|-|-|
|Input|any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { NullStream } from "streams/mod.mjs"

await readable
  .pipeTo(new NullStream)
```