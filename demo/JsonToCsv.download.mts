import * as streams from "../mod.mjs"
import { DownloadStream } from "../DownloadStream/DownloadStream.mjs"

const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement

btnConvertUrl.onclick = async () =>
  fetch(txtUrl.value, { credentials: "include" }).then(response => {
    if (!response.body) {
      return
    }
    response.body
      .pipeThrough(new TextDecoderStream)
      .pipeThrough(new streams.JsonDeserializerStream({ lineSeparated: response.headers.get("content-type")?.includes("jsonl") }))
      .pipeThrough(new streams.CsvLineEncoderStream({ withNewLine: true }))
      .pipeTo(new DownloadStream("download.csv"))
  })