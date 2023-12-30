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

export class DownloadStream extends WritableStream {
  constructor(name: string) {
    let directory: FileSystemDirectoryHandle
    let handle: FileSystemFileHandle
    let fileStream: FileSystemWritableFileStream

    super({
      async start() {
        directory = await navigator.storage.getDirectory()
        handle = await directory.getFileHandle(name, { create: true })
        fileStream = await handle.createWritable()
      },
      async write(chunk) {
        await fileStream.write(chunk)
      },
      async close() {
        await fileStream.close();
        const file = await handle.getFile()
        const url = URL.createObjectURL(file)
        const trigger = document.createElement("a")
        trigger.href = url
        trigger.target = "_blank"
        trigger.download = name
        trigger.click()
        trigger.remove()
        setTimeout(() => URL.revokeObjectURL(url), 10 * 1000)
      },
      async abort(reason) {
        fileStream.abort(reason)
        await directory.removeEntry(name)
      }
    })
  }
}