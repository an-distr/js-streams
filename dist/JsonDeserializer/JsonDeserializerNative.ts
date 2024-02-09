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

function sanitizeForJson(value: string): string {
  let b = true
  while (b) {
    const s = value.slice(0, 1)
    if ([",", "[", " ", "\r", "\n", "\t"].includes(s)) {
      value = value.slice(1)
    }
    else {
      b = false
    }
  }
  b = true
  while (b) {
    const s = value.slice(-1)
    if ([",", "]", " ", "\r", "\n", "\t"].includes(s)) {
      value = value.slice(0, -1)
    }
    else {
      b = false
    }
  }
  return value
}

export function sanitize(value: string, lineSeparated: bool): string {
  if (lineSeparated) {
    return sanitizeForJson(value
      .split("\r\n").filter(x => x.length > 0).join("\n")
      .split("\n").filter(x => x.length > 0).join(","))
  }
  else {
    return sanitizeForJson(value)
  }
}

export function indexOfLastSeparator(value: string, lineSeparated: bool): i32 {
  if (lineSeparated) {
    const length = value.length - 1
    for (let i = length; i >= 0; i--) {
      if (value[i] === "\n") {
        return i
      }
    }
    return -1
  }
  else {
    const length = value.length - 1
    let nextStart = -1
    let separator = -1
    for (let i = length; i >= 0; i--) {
      const s = value[i]
      if (s === "{") {
        nextStart = i
      }
      else if (s === ",") {
        separator = i
      }
      else if (s === "}") {
        if (nextStart > separator && separator > i) {
          return separator
        }
      }
    }
    return -1
  }
}