# PerformanceStream

## Description
Measure the processing time of the Stream.

## Example
https://an-js-streams.pages.dev/.site/test?mod=PerformanceStream

## Usage
```ts
import { PerformanceStream } from "https://an-js-streams.pages.dev/mod.js" // or .ts

// Setup measure and mark name.
const builder = new PerformanceStreamBuilder("perf", "start", "end")

await readable
  .pipeThrough(builder
    .pipe(new TransformStream(...)) // Pipe to targets.
    .pipe(new TransformStream(...))
    .pipe(new TransformStream(...))
    .build()) // Build PerformanceStream instance.
  .pipeTo(writable)

// Get result.
const result = builder.result()
console.table(result)
```