# CombinedTransformStream

## Description
Combine multiple TransfromStreams.

## Example
https://an-js-streams.pages.dev/.site/test?mod=CombinedTransformStream

## Usage
```ts
import { CombinedTransformStream } from "https://an-js-streams.pages.dev/mod.js" // or .ts

await readable
  .pipeThrough(new CombinedTransformStream([
    new TransformStream(...),
    new TransformStream(...),
    new TransformStream(...),
  ]))
  .pipeTo(writable)
```