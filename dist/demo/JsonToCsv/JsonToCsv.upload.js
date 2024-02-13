import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const rdoInputFormatJSONL = document.getElementById("rdoInputFormatJSONL");
const rdoInputFormatJSONC = document.getElementById("rdoInputFormatJSONC");
const rdoOutputFormatCSV = document.getElementById("rdoOutputFormatCSV");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.lastElementChild;
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
  const jsonDeserializeOptions = {
    lineSeparated: rdoInputFormatJSONL.checked,
    withComments: rdoInputFormatJSONC.checked
  };
  const csvLineEncoderOptions = {
    delimiter: rdoOutputFormatCSV.checked ? "," : "	",
    withNewLine: true
  };
  const downloadName = rdoOutputFormatCSV.checked ? "download.csv" : "download.jsv";
  txtFile.files[0].stream().pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.JsonDeserializer(jsonDeserializeOptions).transform()).pipeThrough(new streams.CsvLineEncoder(csvLineEncoderOptions).transform()).pipeTo(new streams.DownloadStream(downloadName, downloadStreamOptions));
};
//# sourceMappingURL=JsonToCsv.upload.js.map
