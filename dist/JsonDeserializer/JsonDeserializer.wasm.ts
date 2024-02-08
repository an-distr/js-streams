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

const CODE_COMMA: i32 = ",".charCodeAt(0)
const CODE_LEFT_CURLY_BRACKET: i32 = "{".charCodeAt(0)
const CODE_RIGHT_CURLY_BRACKET: i32 = "}".charCodeAt(0)
const CODE_LEFT_SQUARE_BRACKET: i32 = "[".charCodeAt(0)
const CODE_RIGHT_SQUARE_BRACKET: i32 = "]".charCodeAt(0)
const CODE_CARRIAGE_RETURN: i32 = "\r".charCodeAt(0)
const CODE_LINE_FEED: i32 = "\n".charCodeAt(0)
const CODE_TAB: i32 = "\t".charCodeAt(0)

function sanitizeForJson(value: string): string {
  let b: bool = true
  while (b) {
    const c = value.charCodeAt(0)
    if (c === CODE_COMMA ||
      c === CODE_LEFT_SQUARE_BRACKET ||
      c === CODE_CARRIAGE_RETURN ||
      c === CODE_LINE_FEED ||
      c === CODE_TAB) {
      value = value.slice(1)
    }
    else {
      b = false
    }
  }
  b = true
  while (b) {
    const len: i32 = value.length
    const c: i32 = value.charCodeAt(len-1)
    if (c === CODE_COMMA ||
      c === CODE_RIGHT_SQUARE_BRACKET ||
      c === CODE_CARRIAGE_RETURN ||
      c === CODE_LINE_FEED ||
      c === CODE_TAB) {
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
      .split("\r\n").filter(x => !x).join("\n")
      .split("\n").filter(x => !x).join(","))
  }
  else {
    return sanitizeForJson(value)
  }
}

export function indexOfLastSeparator(value: string, lineSeparated: bool): i32 {
  if (lineSeparated) {
    let len: i32 = value.length
    for (let i: i32 = len- 1; i >= 0; i--) {
      if (value.charCodeAt(i) === CODE_LINE_FEED) {
        return i
      }
    }
  }
  else {
    let nextStart: i32 = -1
    let separator: i32 = -1
    let len: i32 = value.length
    for (let i: i32 = len- 1; i >= 0; i--) {
      const c: i32 = value.charCodeAt(i)
      if (c === CODE_LEFT_CURLY_BRACKET) {
        nextStart = i
      }
      else if (c === CODE_COMMA) {
        separator = i
      }
      else if (c === CODE_RIGHT_CURLY_BRACKET) {
        if (nextStart > separator && separator > i) {
          return separator
        }
      }
    }
  }

  return -1
}