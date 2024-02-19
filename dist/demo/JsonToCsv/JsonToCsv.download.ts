// @ts-ignore
import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const rdoInputFormatJSON = document.getElementById("rdoInputFormatJSON") as HTMLInputElement
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL") as HTMLInputElement
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC") as HTMLInputElement
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV") as HTMLInputElement
const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement
const linkHolder = btnConvertUrl.parentElement!.lastElementChild as HTMLDivElement

const onChangeInputFromat = () => {
  if (rdoInputFormatJSON.checked) {
    txtUrl.value = new URL("sample.json", location.href).href
  }
  else if (rdoInputFormatJSONL.checked) {
    txtUrl.value = new URL("sample.jsonl", location.href).href
  }
  else if (rdoInputFormatJSONC.checked) {
    txtUrl.value = new URL("sample.jsonc", location.href).href
  }
}
rdoInputFormatJSON.addEventListener("change", onChangeInputFromat)
rdoInputFormatJSONL.addEventListener("change", onChangeInputFromat)
rdoInputFormatJSONC.addEventListener("change", onChangeInputFromat)

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