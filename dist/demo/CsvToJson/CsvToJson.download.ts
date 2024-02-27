// @ts-ignore
import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV") as HTMLInputElement
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV") as HTMLInputElement
const rdoHeaderDetectionFromFile = document.getElementById("rdoHeaderDetectionFromFile") as HTMLInputElement
const rdoOutputFormatJSON = document.getElementById("rdoOutputFormatJSON") as HTMLInputElement
const rdoOutputFormatJSONL = document.getElementById("rdoOutputFormatJSONL") as HTMLInputElement
const txtUrl = document.getElementById("txtUrl") as HTMLInputElement
const btnConvertUrl = document.getElementById("btnConvertUrl") as HTMLButtonElement
const linkHolder = btnConvertUrl.parentElement!.lastElementChild as HTMLDivElement

const onChangeInputFormat = () => {
  if (rdoInputFormatCSV.checked) {
    txtUrl.value = new URL("sample.csv", location.href).href
  }
  else if (rdoInputFormatTSV.checked) {
    txtUrl.value = new URL("sample.tsv", location.href).href
  }
}
rdoInputFormatCSV.addEventListener("change", onChangeInputFormat)
rdoInputFormatTSV.addEventListener("change", onChangeInputFormat)

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

    const csvDeserializerOptions = {
      hasHeader: rdoHeaderDetectionFromFile.checked,
      delimiter: rdoInputFormatCSV.checked ? "," : "\t",
    }

    const jsonSerializeOptions = {
      lineSeparated: rdoOutputFormatJSONL.checked,
    }

    const downloadName = rdoOutputFormatJSON.checked
      ? "download.json"
      : "download.jsonl"

    response.body!
      .pipeThrough(new streams.Utf8DecoderStream())
      .pipeThrough(new streams.CsvDeserializer(csvDeserializerOptions).transformable())
      .pipeThrough(new streams.JsonSerializer(jsonSerializeOptions).transformable())
      .pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions))
  })
}