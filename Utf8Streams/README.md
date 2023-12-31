# Utf8Streams

## Description
Convert streams and UTF-8 strings to and from each other.
It is an alternative in environments where [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)/[TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream) is not available.

## Stream type
* [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)

## Input/output definition
|Direction|Type|
|-|-|
|Input|AllowSharedBufferSource|
|Output|string|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { Utf8DecoderStream, Utf8EncoderStream } from "https://an-js-streams.pages.dev/Utf8Streams/Utf8Streams.mjs"

await readable
  .pipeThrough(new Utf8DecoderStream)
  .pipeThrough(new Utf8EncoderStream)
  .pipeTo(writable)
```