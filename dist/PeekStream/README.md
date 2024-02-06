# PeekStream

## Description
Peeking chunk of stream.

## Example
https://an-js-streams.pages.dev/mod#PeekStream

## Usage
```ts
import { PeekStream } from "https://an-js-streams.pages.dev/mod.js" // or .ts

await readable
  // Peeking chunk.
  .pipeThrough(new PeekStream((chunk) => console.log(chunk)))
  // Peeking chunk with index.
  .pipeThrough(new PeekStream((chunk, index) => console.log(`${index}: ${chunk}`)))
  .pipeTo(writable)
```