// @ts-ignore
import * as streams from "/web.ts"

globalThis.console = new streams.DomConsole("console", globalThis.console)

const txtFile = document.getElementById("txtFile") as HTMLInputElement
const txtResult = document.getElementById("txtResult") as HTMLTextAreaElement
const imgResult = document.getElementById("imgResult") as HTMLImageElement

txtFile.onchange = async () => {
  if (!txtFile.files || txtFile.files.length === 0) {
    return
  }

  let base64 = ""

  await txtFile.files[0].stream()
    .pipeThrough(new streams.BaseEncoder("base64").transformable())
    .pipeTo(new WritableStream({
      write(chunk) {
        base64 += chunk
      }
    }))

  txtResult.value = base64
  txtResult.dispatchEvent(new Event("input"))
}

txtResult.oninput = () => {
  imgResult.src = `data:image/png;base64,${txtResult.value}`
}