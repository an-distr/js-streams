# Streams
Stream utilities for JavaScript/TypeScript.

* **This is a project that I made as a hobby while learning TypeScript. Sudden breaking changes and management that do not take into account distribution may occur. If you want long-term retention, plese fork or copy.**

* **I don't understand English very well. I use a translation tool. I'm sorry if the sentence is wrong.**

## Compatibility
* \>= ECMAScript2018
* Engines
  * V8(Chromium, Node.js, Deno)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS, Bun)
  * SpiderMonkey(FireFox)

## Modules
|Module|Description|
|-|-|
|[ArrayAccumulator](dist/ArrayAccumulator/README.md)|Accumulate the stream and emit it at a constant size array.|
|[ArrayBufferAccumulator](dist/ArrayBufferAccumulator/README.md)|Accumulate the ArrayBuffer stream and emit it at a constant size or condition.|
|[AssertStream](dist/AssertStream/README.md)|Assert for Stream.|
|[CombinedTransformStream](dist/CombinedTransformStream/README.md)|Combine multiple TransfromStreams.|
|[CsvLineEncoder](dist/CsvLineEncoder/README.md)|Convert the object to a CSV line.|
|[DownloadStream](dist/DownloadStream/README.md)|Download the stream.|
|[Flattener](dist/Flattener/README.md)|Flatten the array.|
|[JsonDeserializer](dist/JsonDeserializer/README.md)|Convert the string to a JSON/JSON Lines array.|
|[JsonSerializer](dist/JsonSerializer/README.md)|Convert the object to a JSON/JSON Lines string.|
|[PeekStream](dist/PeekStream/README.md)|Peeking chunk of stream.|
|[PerformanceStream](dist/PerformanceStream/README.md)|Measure the processing time of the Stream.|
|[Utf8Streams](dist/Utf8Streams/README.md)|Convert streams and UTF-8 strings to and from each other.|

## Functions
* [Functions](dist/funcs/README.md)

## Unrelated
* [DomConsole](dist/misc/DomConsole/README.md)
* [Environment](dist/misc/Environment/README.md)

## Demos and Examples
* [https://an-js-streams.pages.dev/](https://an-js-streams.pages.dev/)

## License
This project is licensed under the [MIT No Attribution (MIT-0)](LICENSE).