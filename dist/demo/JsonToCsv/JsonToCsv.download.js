import * as streams from "/web.js";
const chkDirect = document.getElementById("chkDirect");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = btnConvertUrl.parentElement.lastElementChild;
btnConvertUrl.onclick = () => {
  fetch(txtUrl.value, { credentials: "include" }).then(async (response) => {
    if (!response.ok) {
      console.warn(`${txtUrl.value} responded status code ${response.status}.`, await response.text());
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
    response.body.pipeThrough(new streams.Utf8DecoderStream()).pipeThrough(new streams.JsonDeserializer(deserializeOptions).transform()).pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform()).pipeTo(new streams.DownloadStream("download.csv", downloadOptions));
  });
};
//# sourceMappingURL=JsonToCsv.download.js.map
