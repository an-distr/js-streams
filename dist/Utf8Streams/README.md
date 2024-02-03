# Utf8Streams

## Description
Convert streams and UTF-8 strings to and from each other.
It is an alternative in environments where [TextDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)/[TextEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream) is not available.

## Example
https://an-js-streams.pages.dev/.site/test?mod=Utf8Streams

## Usage
```ts
import { Utf8EncoderStream, Utf8DecoderStream } from "https://an-js-streams.pages.dev/mod.js" // or .ts

await readable
  .pipeThrough(new Utf8DecoderStream()) // Instead of "new TextDecoderStream("utf-8")"
  .pipeThrough(new Utf8EncoderStream()) // Instead of "new TextEncoderStream("utf-8")"
  .pipeTo(writable)
```