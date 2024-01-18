import * as streams from "../mod.mts"
import { DownloadStream, DownloadStreamOptions } from "../DownloadStream/DownloadStream.mts"

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
    .pipeThrough(new streams.Utf8DecoderStream)
    .pipeThrough(new streams.JsonDeserializer({ lineSeparated: txtFile.name.includes(".jsonl") }).transform())
    .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
    .pipeTo(new DownloadStream("download.csv", options))
}