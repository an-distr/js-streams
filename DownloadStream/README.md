# DownloadStream

## Description
Download the stream.

## Input/output definition
|Direction|Type|
|-|-|
|Input|any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines(Web browser only)
  * V8(Chromium)

## Usage
```ts
import { DownloadStream } from "streams/mod.mjs"

const download = new DownloaderStream(
  // Specify save name.
  name: "download.txt"
)

await readable
  .pipeThrough(download)
  .pipeTo(writable)
```