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
|[ArrayBufferAccumulator](ArrayBufferAccumulator/README.md)|Accumulate the ArrayBuffer stream and emit it at a constant size or condition.|
|[ArrayAccumulator](ArrayAccumulator/README.md)|Accumulate the stream and emit it at a constant size array.|
|[JsonDeserializer](JsonDeserializer/README.md)|Convert the string to a JSON/JSON Lines array.|
|[JsonSerializer](JsonSerializer/README.md)|Convert the object to a JSON/JSON Lines string.|
|[CsvLineEncoder](CsvLineEncoder/README.md)|Convert the object to a CSV line.|
|[Flattener](Flattener/README.md)|Flatten the array.|
|[Utf8Streams](Utf8Streams/README.md)|Convert streams and UTF-8 strings to and from each other.|
|[PeekStream](PeekStream/README.md)|Peeking chunk of stream.|
|[CombinedTransformStream](CombinedTransformStream/README.md)|Combine multiple TransfromStreams.|
|[PerformanceStream](PerformanceStream/README.md)|Measure the processing time of the Stream.|
|[AssertStream](AssertStream/README.md)|Assert for Stream.|
|[DownloadStream](DownloadStream/README.md)|Download the stream.|

## Functions
* [Functions](./funcs/README.md)

## Unrelated
* [DomConsole](./misc/DomConsole/README.md)

## Demo / Test
* [https://an-js-streams.pages.dev/](https://an-js-streams.pages.dev/)

## License
This project is licensed under the [MIT No Attribution (MIT-0)](LICENSE).