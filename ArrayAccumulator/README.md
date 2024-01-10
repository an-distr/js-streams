# ArrayAccumulator

## Description
Accumulate the array and emit it at a constant size array.

## Example
https://an-js-streams.pages.dev/ArrayAccumulator/test/test.html

## Usage
```ts
import { ArrayAccumulator } from "https://an-js-streams.pages.dev/mod.mjs"

const array = [1, 2, 3, 4, 5]

// Create accumulator with constant emit size and initial data.
const accumulator = new ArrayAccumulator(2, array)
for await (const value of accumulator) { // The ArrayAccumulator works as an AsyncGenerator.
  console.log(value)
  // [1, 2]
  // [3, 4]
  // [5]
}

// Create accumulator with constant emit size and lazy specify data.
const accumulator = new ArrayAccumulator(2)
for await (const value of accumulator.pushpull(array)) { // pushpull function is Push and pull at the same time.
  console.log(value)
  // [1, 2]
  // [3, 4]
  // [5]
}

// It can also be processed as a stream.
const readable = accumulator.readable()
const transform = accumulator.transform()
const writable = accumulator.writable()
```