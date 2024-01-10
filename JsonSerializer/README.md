# JsonSerializer

## Description
Convert the object to a JSON/JSON Lines string.

## Example
https://an-js-streams.pages.dev/JsonSerializer/test/test.html

## Usage
```ts
import { JsonSerializer } from "https://an-js-streams.pages.dev/mod.mjs"

const serializer = new JsonSerializer({
  // Specify true if the JSON data is separated by line breaks (e.g., JSON Lines). The initial value is false.
  lineSeparated: boolean
})

// Push the JSON/JSON Lines data.
const data = "e.g., JSON/JSON Lines string(s) data"
await serializer.push(data)

// Retrieve the data.
for await (const obj of serializer) {
  console.log(obj)
}

// It can also be processed as a stream.
const readable = serializer.readable()
const transform = serializer.transform()
const writable = serializer.writable()
```