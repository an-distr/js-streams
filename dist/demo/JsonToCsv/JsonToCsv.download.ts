import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL") as HTMLInputElement
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC") as HTMLInputElement
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV") as HTMLInputElement
const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement
const linkHolder = btnConvertUrl.parentElement!.lastElementChild as HTMLDivElement

btnConvertUrl.onclick = () => {
  fetch(txtUrl.value, { credentials: "include" }).then(async response => {
    if (!response.ok) {
      console.warn(`${txtUrl.value} responded status code ${response.status}.`, await response.text())
      return
    }

    let downloadStreamOptions: streams.DownloadStreamOptions | undefined
    if (!chkDirect.checked) {
      downloadStreamOptions = {
        linkHolder,
      }
    }

    const jsonDeserializeOptions = {
      lineSeparated: rdoInputFormatJSONL.checked,
      withComments: rdoInputFormatJSONC.checked,
    }

    const csvLineEncoderOptions = {
      delimiter: rdoOutputFormatCSV.checked
        ? ","
        : "\t",
      withNewLine: true,
    }

    const downloadName = rdoOutputFormatCSV.checked
      ? "download.csv"
      : "download.tsv"

    response.body!
      .pipeThrough(new streams.Utf8DecoderStream())
      .pipeThrough(new streams.JsonDeserializer(jsonDeserializeOptions).transform())
      .pipeThrough(new streams.CsvLineEncoder(csvLineEncoderOptions).transform())
      .pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions))
  })
}