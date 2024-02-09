# JsonDeserializer

## Description
Convert the string to a JSON/JSON Lines array.

## Example
https://an-js-streams.pages.dev/mod#JsonDeserializer

## Usage
```ts
import { JsonDeserializer } from "https://an-js-streams.pages.dev/mod.js" // or .ts

const deserializer = new JsonDeserializer({
  // Specify true if the JSON data is separated by line breaks (e.g., JSON Lines). The initial value is false.
  lineSeparated: boolean
  // Specify a custom JSON parser if necessary.
  parse?: (text: string) => any
})

// You can also switch to the WebAssembly implementation if you want.
// Note: Caution should be exercised when using it for experimental implementation.
await deserializer.nativization()

// Push the JSON/JSON Lines data.
const data = [ /* Objects */ ]
await deserializer.push(data)

// Retrieve the data.
for await (const obj of deserializer) {
  console.log(obj)
}

// It can also be processed as a stream.
const readable = deserializer.readable()
const transform = deserializer.transform()
const writable = deserializer.writable()
```