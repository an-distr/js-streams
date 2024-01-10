# CsvLineEncoder

## Description
Convert the object to a CSV line.

## Example
https://an-js-streams.pages.dev/CsvLineEncoder/test/test.html

## Usage
```ts
import { CsvLineEncoder } from "https://an-js-streams.pages.dev/mod.mjs"

const encoder = new CsvLineEncoder({
  // Specifies the delimiter. The default value is ",".
  delimiter: ",",
  // Specifies how escaping is performed. The default value is "auto".
  // "auto"  : It will determine automatically.
  // "all"   : It is enforced to apply to all items.
  // "none"  : We don't do it at all.
  // function: You can describe any process you like.
  escape: "auto" | "all" | "none" | (s: string) => s,
  // Specify true to include newline characters at the end of the output. If false, do not include. The initial value is true.
  withNewLine: true,
  // Specifies the trailing line feed code. The default value is "\n".
  newLine: true,
})

const data = [
  { a: 1, b: 2 },
  { a: 3, b: 4 },
  { a: 5, b: 6 },
]

await encoder.push(data)

for await (const line of encoder) {
  // 1,2\n
  // 3,4\n
  // 5,6\n
}

// It can also be processed as a stream.
const readable = encoder.readable()
const transform = encoder.transform()
const writable = encoder.writable()
```