# toAsyncIterableIterator

## Description
ReadableStream to AsyncIterableIterator.

## Example
https://an-js-streams.pages.dev/mod#funcs/toAsyncIterableIterator

## Usage
```ts
import * as funcs from "https://an-js-streams.pages.dev/funcs/mod.js" // or .ts

const stream = readable.pipeThrough(...)...

// If you need to interrupt, set AbortController.signal to optional.
const controller = new AbortController()
const options = new toAsyncIterableIteratorOptions = {
  signal: controller.signal,
}

for await (const chunk of funcs.toAsyncIterableIterator(stream, options)) {
  ...
}
```