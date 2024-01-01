import * as streams from "../mod.mjs"
import { DownloadStream } from "../DownloadStream/DownloadStream.mjs"

const txtFile = document.getElementById("txtFile") as HTMLInputElement

txtFile.onchange = async () => {
  if (!txtFile.files) {
    return
  }

  txtFile.files![0].stream()
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new streams.JsonDeserializerStream({ lineSeparated: txtFile.name.includes(".jsonl") }))
    .pipeThrough(new streams.CsvLineEncoderStream({ withNewLine: true }))
    .pipeTo(new DownloadStream("download.csv"))
}