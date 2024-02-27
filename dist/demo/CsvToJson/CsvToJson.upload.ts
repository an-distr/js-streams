// @ts-ignore
import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV") as HTMLInputElement
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV") as HTMLInputElement
const rdoHeaderDetectionFromFile = document.getElementById("rdoHeaderDetectionFromFile") as HTMLInputElement
const rdoOutputFormatJSON = document.getElementById("rdoOutputFormatJSON") as HTMLInputElement
const rdoOutputFormatJSONL = document.getElementById("rdoOutputFormatJSONL") as HTMLInputElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const linkHolder = txtFile.parentElement!.lastElementChild as HTMLDivElement

const onChangeInputFormat = () => {
  if (rdoInputFormatCSV.checked) {
    txtFile.accept = ".csv"
  }
  else if (rdoInputFormatTSV.checked) {
    txtFile.accept = ".tsv"
  }
}
rdoInputFormatCSV.addEventListener("change", onChangeInputFormat)
rdoInputFormatTSV.addEventListener("change", onChangeInputFormat)

txtFile.onchange = () => {
  if (!txtFile.files) {
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

  txtFile.files![0].stream()
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.CsvDeserializer(csvDeserializerOptions).transformable())
    .pipeThrough(new streams.JsonSerializer(jsonSerializeOptions).transformable())
    .pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions))
}