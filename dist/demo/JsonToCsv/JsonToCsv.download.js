import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL");
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC");
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = btnConvertUrl.parentElement.lastElementChild;
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
    const downloadName = rdoOutputFormatCSV.checked ? "download.csv" : "download.jsv";
    response.body.pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.JsonDeserializer(jsonDeserializeOptions).transform()).pipeThrough(new streams.CsvLineEncoder(csvLineEncoderOptions).transform()).pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions));
  });
};
//# sourceMappingURL=JsonToCsv.download.js.map
