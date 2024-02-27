// @ts-ignore
import * as streams from "/web.ts"

const chkDirect = document.getElementById("chkDirect") as HTMLInputElement
const rdoInputFormatJSON = document.getElementById("rdoInputFormatJSON") as HTMLInputElement
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL") as HTMLInputElement
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC") as HTMLInputElement
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV") as HTMLInputElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const linkHolder = txtFile.parentElement!.lastElementChild as HTMLDivElement

const onChangeInputFromat = () => {
  if (rdoInputFormatJSON.checked) {
    txtFile.accept = ".json"
  }
  else if (rdoInputFormatJSONL.checked) {
    txtFile.accept = ".jsonl"
  }
  else if (rdoInputFormatJSONC.checked) {
    txtFile.accept = ".jsonc"
  }
}
rdoInputFormatJSON.addEventListener("change", onChangeInputFromat)
rdoInputFormatJSONL.addEventListener("change", onChangeInputFromat)
rdoInputFormatJSONC.addEventListener("change", onChangeInputFromat)

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

  const jsonDeserializeOptions = {
    lineSeparated: rdoInputFormatJSONL.checked,
    withComments: rdoInputFormatJSONC.checked,
  }

  const csvSerializerOptions = {
    delimiter: rdoOutputFormatCSV.checked
      ? ","
      : "\t",
    withNewLine: true,
  }

  const downloadName = rdoOutputFormatCSV.checked
    ? "download.csv"
    : "download.tsv"

  txtFile.files![0].stream()
    .pipeThrough(new streams.Utf8DecoderStream())
    .pipeThrough(new streams.JsonDeserializer(jsonDeserializeOptions).transformable())
    .pipeThrough(new streams.CsvSerializer(csvSerializerOptions).transformable())
    .pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions))
}