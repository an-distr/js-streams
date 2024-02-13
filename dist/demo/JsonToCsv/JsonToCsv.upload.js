import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.lastElementChild;
txtFile.onchange = () => {
  if (!txtFile.files) {
    return;
  }
  let downloadOptions;
  if (!chkDirect.checked) {
    downloadOptions = {
      linkHolder
    };
  }
  const deserializeOptions = {
    lineSeparated: document.getElementById("rdoFormatJSONL").checked,
    withComments: document.getElementById("rdoFormatJSONC").checked
  };
  txtFile.files[0].stream().pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.JsonDeserializer(deserializeOptions).transform()).pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform()).pipeTo(new streams.DownloadStream("download.csv", downloadOptions));
};
//# sourceMappingURL=JsonToCsv.upload.js.map
