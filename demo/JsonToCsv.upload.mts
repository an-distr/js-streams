import * as streams from "../mod.mjs"
import { DownloadStream, DownloadStreamOptions } from "../DownloadStream/DownloadStream.mjs"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const linkHolder = txtFile.parentElement!.querySelector("div") as HTMLDivElement

txtFile.onchange = async () => {
  linkHolder.innerHTML = ""
  if (!txtFile.files) {
    return
  }

  let options: DownloadStreamOptions | undefined
  if (!chkDirect.checked) {
    options = {
      linkHolder
    }
  }

  txtFile.files![0].stream()
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new streams.JsonDeserializerStream({ lineSeparated: txtFile.name.includes(".jsonl") }))
    .pipeThrough(new streams.CsvLineEncoderStream({ withNewLine: true }))
    .pipeTo(new DownloadStream("download.csv", options))
}