# ReadableStream.asyncIterator

## Description
Polyfill Symbol.asyncIterator to ReadableStream.

## Example
https://an-js-streams.pages.dev/mod#polyfill/ReadableStream.asyncIterator

## Usage
```ts
import "https://an-js-streams.pages.dev/polyfill/mod.js" // or .ts

const stream = readable.pipeThrough(...)...

for await (const chunk of stream) {
  ...
}
```