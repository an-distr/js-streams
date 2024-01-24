import * as streams from "../mod.ts"
import { DownloadStream, DownloadStreamOptions } from "../DownloadStream/DownloadStream.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement
const linkHolder = btnConvertUrl.parentElement!.lastElementChild as HTMLDivElement

btnConvertUrl.onclick = async () => {
  fetch(txtUrl.value, { credentials: "include" }).then(response => {
    if (!response.body) {
      return
    }

    let options: DownloadStreamOptions | undefined
    if (!chkDirect.checked) {
      options = {
        linkHolder
      }
    }

    response.body
      .pipeThrough(new streams.Utf8DecoderStream)
      .pipeThrough(new streams.JsonDeserializer({ lineSeparated: response.headers.get("content-type")?.includes("jsonl") }).transform())
      .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
      .pipeTo(new DownloadStream("download.csv", options))
  })
}