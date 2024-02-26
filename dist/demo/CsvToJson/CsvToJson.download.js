import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const rdoInputFormatCSV = document.getElementById("rdoInputFormatCSV");
const rdoInputFormatTSV = document.getElementById("rdoInputFormatTSV");
const rdoOutputFormatJSON = document.getElementById("rdoOutputFormatJSON");
const rdoOutputFormatJSONL = document.getElementById("rdoOutputFormatJSONL");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = btnConvertUrl.parentElement.lastElementChild;
const onChangeInputFromat = () => {
  if (rdoInputFormatCSV.checked) {
    txtUrl.value = new URL("sample.csv", location.href).href;
  } else if (rdoInputFormatTSV.checked) {
    txtUrl.value = new URL("sample.tsv", location.href).href;
  }
};
rdoInputFormatCSV.addEventListener("change", onChangeInputFromat);
rdoInputFormatTSV.addEventListener("change", onChangeInputFromat);
btnConvertUrl.onclick = () => {
  fetch(txtUrl.value, { credentials: "include" }).then(async (response) => {
    if (!response.ok) {
      console.warn(`${txtUrl.value} responded status code ${response.status}.`, await response.text());
      return;
    }
    let downloadStreamOptions;
    if (!chkDirect.checked) {
      downloadStreamOptions = {
        linkHolder
      };
    }
    const csvDeserializerOptions = {
      hasHeader: true,
      delimiter: rdoInputFormatCSV.checked ? "," : "	"
    };
    const jsonSerializeOptions = {
      lineSeparated: rdoOutputFormatJSONL.checked
    };
    const downloadName = rdoOutputFormatJSON.checked ? "download.json" : "download.jsonl";
    response.body.pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.CsvDeserializer(csvDeserializerOptions).transformable()).pipeThrough(new streams.JsonSerializer(jsonSerializeOptions).transformable()).pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions));
  });
};
//# sourceMappingURL=CsvToJson.download.js.map
