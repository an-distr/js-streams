# PeekStream

## Description
Peeking chunk of stream.

## Example
https://an-js-streams.pages.dev/PeekStream/test/test.html

## Usage
```ts
import { PeekStream } from "https://an-js-streams.pages.dev/mod.js"

await readable
  // Peeking chunk.
  .pipeThrough(new PeekStream((chunk) => console.log(chunk)))
  // Peeking chunk with index.
  .pipeThrough(new PeekStream((chunk, index) => console.log(`${index}: ${chunk}`)))
  .pipeTo(writable)
```