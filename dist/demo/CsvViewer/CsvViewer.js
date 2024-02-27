import * as streams from "/web.js";
globalThis.console = new streams.DomConsole("console", globalThis.console);
const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV");
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV");
const lblRecords = document.getElementById("lblRecords");
const txtFile = document.getElementById("txtFile");
const tblResult = document.getElementById("tblResult");
const onChangeInputFormat = () => {
  if (rdoInputFormatCSV.checked) {
    txtFile.accept = ".csv";
  } else if (rdoInputFormatTSV.checked) {
    txtFile.accept = ".tsv";
  }
};
rdoInputFormatCSV.addEventListener("change", onChangeInputFormat);
rdoInputFormatTSV.addEventListener("change", onChangeInputFormat);
let controller;
txtFile.onchange = async () => {
  if (!controller || !controller.signal.aborted) {
    controller?.abort();
    controller = new AbortController();
  }
  tblResult.innerHTML = "";
  tblResult.createTBody();
  if (!txtFile.files || txtFile.files.length === 0) {
    return;
  }
  const source = txtFile.files[0].stream().pipeThrough(new streams.Utf8DecoderStream(), { signal: controller.signal }).pipeThrough(new streams.CsvDeserializer({
    hasHeader: true,
    delimitor: rdoInputFormatTSV.checked ? "	" : ","
  }).transformable(), { signal: controller.signal });
  let no = 1;
  for await (const obj of streams.toAsyncIterableIterator(source, { signal: controller.signal })) {
    if (!tblResult.tHead) {
      const head = tblResult.createTHead();
      const row2 = head.insertRow();
      let th = document.createElement("th");
      th.textContent = "#";
      row2.append(th);
      for (const key in obj) {
        th = document.createElement("th");
        th.textContent = key;
        row2.append(th);
      }
    }
    const row = tblResult.tBodies[0].insertRow();
    row.insertCell().textContent = (no++).toLocaleString();
    for (const value of Object.values(obj)) {
      row.insertCell().textContent = value?.toString() ?? "";
    }
    lblRecords.textContent = no.toLocaleString();
    if (no % 1e3 === 0) {
      await streams.sleep(0);
    }
  }
};
//# sourceMappingURL=CsvViewer.js.map
