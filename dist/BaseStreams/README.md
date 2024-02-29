# BaseStreams

## Description
Streaming encode/decode for BaseN.

## Example
https://an-js-streams.pages.dev/mod#BaseStreams

## Usage
```ts
import { BaseEncoder, BaseDecoder } from "https://an-js-streams.pages.dev/mod.js" // or .ts

// Supported modes.
const mode =
  "base16" |
  "base32" |
  "base32hex" |
  "base64" |
  "base64url"

await readable
  .pipeThrough(new TextEncoderStream())
  .pipeThrough(new BaseEncoder(mode).transformable())
  .pipeThrough(new BaseDecoder(mode).transformable())
  .pipeThrough(new TextDecoderStream())
  .pipeTo(writable)
```