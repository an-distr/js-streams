import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV");
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV");
const rdoHeaderDetectionFromFile = document.getElementById("rdoHeaderDetectionFromFile");
const rdoOutputFormatJSON = document.getElementById("rdoOutputFormatJSON");
const rdoOutputFormatJSONL = document.getElementById("rdoOutputFormatJSONL");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.lastElementChild;
const onChangeInputFormat = () => {
  if (rdoInputFormatCSV.checked) {
    txtFile.accept = ".csv";
  } else if (rdoInputFormatTSV.checked) {
    txtFile.accept = ".tsv";
  }
};
rdoInputFormatCSV.addEventListener("change", onChangeInputFormat);
rdoInputFormatTSV.addEventListener("change", onChangeInputFormat);
txtFile.onchange = () => {
  if (!txtFile.files) {
    return;
  }
  let downloadStreamOptions;
  if (!chkDirect.checked) {
    downloadStreamOptions = {
      linkHolder
    };
  }
  const csvDeserializerOptions = {
    hasHeader: rdoHeaderDetectionFromFile.checked,
    delimiter: rdoInputFormatCSV.checked ? "," : "	"
  };
  const jsonSerializeOptions = {
    lineSeparated: rdoOutputFormatJSONL.checked
  };
  const downloadName = rdoOutputFormatJSON.checked ? "download.json" : "download.jsonl";
  txtFile.files[0].stream().pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.CsvDeserializer(csvDeserializerOptions).transformable()).pipeThrough(new streams.JsonSerializer(jsonSerializeOptions).transformable()).pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions));
};
//# sourceMappingURL=CsvToJson.upload.js.map
