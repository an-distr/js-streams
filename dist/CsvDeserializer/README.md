# CsvDeserializer

## Description
Convert the CSV/TSV to a object.

## Example
https://an-js-streams.pages.dev/mod#CsvDeserializer

## Usage
```ts
import { CsvDeserializer } from "https://an-js-streams.pages.dev/mod.js" // or .ts

const deserializer = new CsvDeserializer({
  // If true is specified, the first row of input data is treated as the header row. The initial value is false.
  hasHeader: false,
  // Specify a header if required. If specified, the first row of input data is not used as the header row. The initial value is unspecified.
  fields: [],
  // Specifies the delimiter. The default value is ",".
  delimiter: ",",
  // Specifies the line separated string. The default value is "\n".
  lineSeparator: "\n",
})

const lines = [
  "column1,column2,column3",
  "a,1,\"b,2\\\"\"",
  "c,3,d,4",
  "e,5,f\ng,6,h",
]

await deserializer.push(lines)

for await (const obj of deserializer) {
  // { column1: "a", column2: 1, column3: "b,2\"" }
  // { column1: "c", column2: 3, column3: "d"     }
  // { column1: "e", column2: 5, column3: "f"     }
  // { column1: "g", column2: 6, column3: "h"     }
}

// It can also be processed as a stream.
const readable = deserializer.readable()
const transformable = deserializer.transformable()
const writable = deserializer.writable()
```