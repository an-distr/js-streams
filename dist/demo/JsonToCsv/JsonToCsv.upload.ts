import * as streams from "../../web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const linkHolder = txtFile.parentElement!.lastElementChild as HTMLDivElement

txtFile.onchange = async () => {
  if (!txtFile.files) {
    return
  }

  let options: streams.DownloadStreamOptions | undefined
  if (!chkDirect.checked) {
    options = {
      linkHolder
    }
  }

  txtFile.files![0].stream()
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.JsonDeserializer({ lineSeparated: txtFile.name.includes(".jsonl") }).transform())
    .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
    .pipeTo(new streams.DownloadStream("download.csv", options))
}