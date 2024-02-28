# Base64Streams

## Description
Streaming encode/decode for Base64.

## Example
https://an-js-streams.pages.dev/mod#Base64Streams

## Usage
```ts
import { Base64Encoder, Base64Decoder } from "https://an-js-streams.pages.dev/mod.js" // or .ts

await readable
  .pipeThrough(new TextEncoderStream())
  .pipeThrough(new Base64Encoder().transformable())
  .pipeThrough(new Base64Decoder().transformable())
  .pipeThrough(new TextDecoderStream())
  .pipeTo(writable)
```