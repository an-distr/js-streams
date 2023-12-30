# JsonDeserializerStream

## Description
Convert the stream to a JSON/JSON Lines array.

## Input/output definition
|Direction|Type|
|-|-|
|Input|string|
|Output|any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { JsonDeserializerStream } from "streams/mod.mjs"

const deserializer = new JsonDeserializerStream(
  // The options.
  {
    // If true is specified, it will be processed as JSON Lines. The initial value is false.
    lineSeparated: false,
    // Specify the JSON parser. The initial value is JSON.parse.
    parse: JSON.parse,
  })

await readable
  .pipeThrough(new TextDecoderStream)
  .pipeThrough(deserializer)
  .pipeTo(writable)
```