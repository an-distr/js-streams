/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-distr)

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

export interface DownloadStreamOptions {
  mode?: "blob" | "filesystem"
  linkHolder?: Node
}

export class DownloadStream extends WritableStream {
  constructor(name: string, options?: DownloadStreamOptions) {
    const download = (blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const trigger = document.createElement("a")
      trigger.href = url
      trigger.target = "_blank"
      trigger.download = name
      trigger.innerText = name
      if (options?.linkHolder) {
        options.linkHolder.appendChild(trigger)
      }
      else {
        trigger.click()
        trigger.remove()
        setTimeout(() => URL.revokeObjectURL(url), 10 * 1000)
      }
    }

    if (options?.mode === "filesystem") {
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
          download(file)
        },
        async abort(reason) {
          fileStream.abort(reason)
          await directory.removeEntry(name)
        }
      })
    }

    else {
      let chunks: any[]
      super({
        start() {
          chunks = []
        },
        write(chunk) {
          chunks.push(chunk)
        },
        close() {
          const blob = new Blob(chunks)
          download(blob)
        },
        abort() {
          chunks = []
        }
      })
    }
  }
}