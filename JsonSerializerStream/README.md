# JsonSerializerStream

## Description
Convert the stream to a JSON/JSON Lines string.

## Input/output definition
|Direction|Type|
|-|-|
|Input|any|
|Output|string|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { JsonSerializerStream } from "streams/mod.mjs"

const serializer = new JsonSerializerStream(
  // The options.
  {
    // If true is specified, it will be processed as JSON Lines. The initial value is false.
    lineSeparated: true,
    // Specify the JSON stringify. The initial value is JSON.stringify.
    stringify: JSON.stringify,
  })

await readable
  .pipeThrough(serializer)
  .pipeTo(writable)
```