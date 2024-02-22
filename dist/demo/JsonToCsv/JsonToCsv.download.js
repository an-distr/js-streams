import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const rdoInputFormatJSON = document.getElementById("rdoInputFormatJSON");
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL");
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC");
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = btnConvertUrl.parentElement.lastElementChild;
const onChangeInputFromat = () => {
  if (rdoInputFormatJSON.checked) {
    txtUrl.value = new URL("sample.json", location.href).href;
  } else if (rdoInputFormatJSONL.checked) {
    txtUrl.value = new URL("sample.jsonl", location.href).href;
  } else if (rdoInputFormatJSONC.checked) {
    txtUrl.value = new URL("sample.jsonc", location.href).href;
  }
};
rdoInputFormatJSON.addEventListener("change", onChangeInputFromat);
rdoInputFormatJSONL.addEventListener("change", onChangeInputFromat);
rdoInputFormatJSONC.addEventListener("change", onChangeInputFromat);
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
    const jsonDeserializeOptions = {
      lineSeparated: rdoInputFormatJSONL.checked,
      withComments: rdoInputFormatJSONC.checked
    };
    const csvLineEncoderOptions = {
      delimiter: rdoOutputFormatCSV.checked ? "," : "	",
      withNewLine: true
    };
    const downloadName = rdoOutputFormatCSV.checked ? "download.csv" : "download.tsv";
    response.body.pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.JsonDeserializer(jsonDeserializeOptions).transformable()).pipeThrough(new streams.CsvLineEncoder(csvLineEncoderOptions).transformable()).pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions));
  });
};
//# sourceMappingURL=JsonToCsv.download.js.map
