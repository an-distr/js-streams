# AssertStream

## Description
Assert for Stream.

## Example
https://an-js-streams.pages.dev/AssertStream/test/test.html

## Usage
```ts
import { AssertStream } from "https://an-js-streams.pages.dev/mod.js" // or .ts

await readable
  .pipeThrough(new AssertStream(chunk => chunk === x))
  .pipeTo(writable)
```