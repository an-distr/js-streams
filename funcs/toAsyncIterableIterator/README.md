# toAsyncIterableIterator

## Description
ReadableStream to AsyncIterableIterator.

## Example
https://an-js-streams.pages.dev/.site/test?mod=funcs/toAsyncIterableIterator

## Usage
```ts
import * as funcs from "https://an-js-streams.pages.dev/funcs/mod.js" // or .ts

const stream = readable.pipeThrough(...)...

for await (const chunk of funcs.toAsyncIterableIterator(stream)) {
  ...
}
```