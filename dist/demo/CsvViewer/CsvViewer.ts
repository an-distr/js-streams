// @ts-ignore
import * as streams from "/web.ts"

globalThis.console = new streams.DomConsole("console", globalThis.console)

const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV") as HTMLInputElement
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV") as HTMLInputElement
const lblRecords = document.getElementById("lblRecords") as HTMLSpanElement
const txtFile = document.getElementById("txtFile") as HTMLInputElement
const tblResult = document.getElementById("tblResult") as HTMLTableElement

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

let controller: AbortController | undefined

txtFile.onchange = async () => {
  if (!controller || !controller.signal.aborted) {
    controller?.abort()
    controller = new AbortController()
  }

  tblResult.innerHTML = ""
  tblResult.createTBody()

  if (!txtFile.files || txtFile.files.length === 0) {
    return
  }

  const source = txtFile.files[0].stream()
    .pipeThrough(new streams.Utf8DecoderStream(), { signal: controller.signal })
    .pipeThrough(new streams.CsvDeserializer({
      hasHeader: true,
      delimitor: rdoInputFormatTSV.checked ? "\t" : ",",
    }).transformable(), { signal: controller.signal })

  let no = 1
  for await (const obj of streams.toAsyncIterableIterator(source, { signal: controller.signal })) {
    if (!tblResult.tHead) {
      const head = tblResult.createTHead()
      const row = head.insertRow()
      let th = document.createElement("th")
      th.textContent = "#"
      row.append(th)
      for (const key in obj) {
        th = document.createElement("th")
        th.textContent = key
        row.append(th)
      }
    }
    const row = tblResult.tBodies[0].insertRow()
    row.insertCell().textContent = (no++).toLocaleString()
    for (const value of Object.values(obj)) {
      row.insertCell().textContent = value?.toString() ?? ""
    }
    lblRecords.textContent = no.toLocaleString()
    if (no % 1000 === 0) {
      await streams.sleep(0)
    }
  }
}