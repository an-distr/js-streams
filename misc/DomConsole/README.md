# DomConsole

## Description
Reproduce the output of globalThis.console on HTML.

## Example
https://an-js-streams.pages.dev/misc/DomConsole/test/test.html

## Usage
```html
<!-- Applies a style for the output of the DomConsole. -->
<link rel="stylesheet" href="https://an-js-streams.pages.dev/misc/DomConsole/DomConsole.css">
<link rel="stylesheet" href="https://an-js-streams.pages.dev/misc/DomConsole/DomConsole.theme.chrome.css">

<!-- Initializing the DomConsole -->
<script type="module">
  import { DomConsole } from "https://an-js-streams.pages.dev/misc/DomConsole/DomConsole.mjs"

  // All you need to do is initialize it by specifying the ID of the DomConsole output destination or the reference of the element.
  const myConsole = new DomConsole("myconsole")

  // If you assign it to globalThis.console, all output will be done to the DomConsole.
  globalThis.console = new DomConsole("myconsole")

  // If you want to redirect the output to the DomConsole further, specify the redirection destination.
  // For example, if you do the following, the output to globalThis.console will be redirected via the DomConsole to the browser's debugger.
  globalThis.console = new DomConsole("myconsole", globalThis.console)
</script>

<!-- DomConsole Output Destination -->
<div id="myconsole"></div>
```