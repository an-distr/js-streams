# CsvLineEncoderStream

## Description
Convert the stream to a CSV line.

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
import { CsvLineEncoderStream } from "https://an-js-streams.pages.dev/mod.mjs"

const encoder = new CsvLineEncoderStream(
  // The options.
  {
    // Specifies the delimiter for the field. The initial value is ",".
    delimiter: ",",
    // Specify escape type or custom function. The initial value is "auto".
    escape: "auto" | "all" | "none" | (s: string) => string,
    // Specify true to include a newline code at the end. The initial value is true.
    withNewLine: true,
    // Specifies the newline code to be written when the "withNewLine" parameter is true. The initial value is "\n".
    newLine: "\n",
  })

await readable
  .pipeThrough(encoder)
  .pipeTo(writable)
```