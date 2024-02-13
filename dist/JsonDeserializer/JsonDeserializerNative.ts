/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/// <reference types="assemblyscript/std/assembly" />

const SANITIZE_FOR_JSON_STARTS = [",", "[", " ", "\r", "\n", "\t"]
const SANITIZE_FOR_JSON_ENDS = [",", "]", " ", "\r", "\n", "\t"]
const JSON_S: i32 = 123 // {
const JSON_M: i32 = 44 // ,
const JSON_E: i32 = 125 // }
const JSONL_E: u8 = 10 // \n

// @ts-ignore
@inline
function sanitizeForJson(value: string): string {
  let l = value.length - 1
  let s: i32, e: i32
  for (s = 0; s < l; ++s) {
    if (!SANITIZE_FOR_JSON_STARTS.includes(value[s])) {
      break
    }
  }
  for (e = l; e >= 0; --e) {
    if (!SANITIZE_FOR_JSON_ENDS.includes(value[e])) {
      break
    }
  }
  return value.slice(s, e + 1)
}

export function sanitize_json(value: string): string {
  return sanitizeForJson(value)
}

export function sanitize_jsonl(value: string): string {
  return sanitizeForJson(value
    .split("\r\n").join("\n")
    .split("\n").join(",")
  )
}

export function indexOfLastSeparator_json(value: Uint8Array): i32 {
  const length = value.byteLength - 1
  let nextStart = -1
  let separator = -1
  for (let i = length; i >= 0; i--) {
    const s: i32 = value[i]
    if (s === JSON_S) {
      nextStart = i
    }
    else if (s === JSON_M) {
      separator = i
    }
    else if (s === JSON_E) {
      if (nextStart > separator && separator > i) {
        return separator
      }
    }
  }
  return -1
}