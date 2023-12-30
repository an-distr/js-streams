# DomStreams

## Description
Generate a stream from events in the DOM.

## Input/output definition
|Direction|Type|
|-|-|
|Output|any|

## Compatibility
* \>= ES6(ECMAScript 2015)
* Engines(Web browser only)
  * V8(Chromium)
  * JavaScriptCore(Safari, Browser on iOS/iPadOS)
  * SpiderMonkey(FireFox)

## Usage
```ts
import { HTMLElementStream } from "https://an-js-streams.pages.dev/dom/mod.mjs"

const txt = document.getElementById("txt")

new HTMLElementStream(txt, "input", (t) => t.value).pipeTo(writable).pipeTo(writable)
new HTMLElementStream(txt, "input", (t, e) => e.target.value).pipeTo(writable).pipeTo(writable)
```