# toAsyncIterableIterator

## Description
ReadableStream to AsyncIterableIterator.

## Compatibility
* \>= **ECMAScript 2018 (Require AsyncIterableIterator)**
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Usage
```ts
import * as funcs from "https://an-js-streams.pages.dev/funcs/mod.mjs"

const stream = readable.pipeThrough(...)...

for await (const chunk of funcs.toAsyncIterableIterator(stream)) {
  ...
}
```