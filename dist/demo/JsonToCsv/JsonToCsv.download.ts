import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement
const linkHolder = btnConvertUrl.parentElement!.lastElementChild as HTMLDivElement

btnConvertUrl.onclick = () => {
  fetch(txtUrl.value, { credentials: "include" }).then(async response => {
    if (!response.ok) {
      console.warn(`${txtUrl.value} responded status code ${response.status}.`, await response.text())
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

    response.body!
      .pipeThrough(new streams.Utf8DecoderStream())
      .pipeThrough(new streams.JsonDeserializer(deserializeOptions).transform())
      .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
      .pipeTo(new streams.DownloadStream("download.csv", downloadOptions))
  })
}