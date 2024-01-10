# DownloadStream

## Description
Download the stream.

## Usage
```ts
import { DownloadStream } from "https://an-js-streams.pages.dev/DownloadStream/DownloadStream.mjs"

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

await readable
  .pipeThrough(download)
  .pipeTo(writable)
```