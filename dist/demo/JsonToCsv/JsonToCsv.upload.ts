import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const linkHolder = txtFile.parentElement!.lastElementChild as HTMLDivElement

txtFile.onchange = () => {
  if (!txtFile.files) {
    return
  }

  let downloadOptions: streams.DownloadStreamOptions | undefined
  if (!chkDirect.checked) {
    downloadOptions = {
      linkHolder
    }
  }

  const deserializeOptions = {
    lineSeparated: (document.getElementById("rdoFormatJSONL") as HTMLInputElement).checked,
    withComments: (document.getElementById("rdoFormatJSONC") as HTMLInputElement).checked,
  }

  txtFile.files![0].stream()
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.JsonDeserializer(deserializeOptions).transform())
    .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
    .pipeTo(new streams.DownloadStream("download.csv", downloadOptions))
}