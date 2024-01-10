# toAsyncIterableIterator

## Description
ReadableStream to AsyncIterableIterator.

## Usage
```ts
import * as funcs from "https://an-js-streams.pages.dev/funcs/mod.mjs"

const stream = readable.pipeThrough(...)...

for await (const chunk of funcs.toAsyncIterableIterator(stream)) {
  ...
}
```