# DownloadStream

## Description
Download the stream.

## Example
https://an-js-streams.pages.dev/DownloadStream/test/test.html

## Compatibility
* \>= ECMAScript2018
* **It only works with WebBrowser.**

## Usage
```ts
import { DownloadStream } from "https://an-js-streams.pages.dev/web.js" // or .ts

const download = new DownloaderStream(
  // Specify save name.
  name: "download.txt",
  // Options
  {
    // Specify buffering mode.
    mode: "blob" | "filesystem",
    // If you specify a node, add a link to download it.
    linkHolder: node,
  }
)

await readable.pipeTo(download)
```