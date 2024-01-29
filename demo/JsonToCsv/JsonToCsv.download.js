import * as streams from "../../web.js";
const chkDirect = document.getElementById("chkDirect");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = btnConvertUrl.parentElement.lastElementChild;
btnConvertUrl.onclick = async () => {
    fetch(txtUrl.value, { credentials: "include" }).then(response => {
        var _a;
        if (!response.body) {
            return;
        }
        let options;
        if (!chkDirect.checked) {
            options = {
                linkHolder
            };
        }
        response.body
            .pipeThrough(new streams.Utf8DecoderStream())
            .pipeThrough(new streams.JsonDeserializer({ lineSeparated: (_a = response.headers.get("content-type")) === null || _a === void 0 ? void 0 : _a.includes("jsonl") }).transform())
            .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
            .pipeTo(new streams.DownloadStream("download.csv", options));
    });
};
//# sourceMappingURL=JsonToCsv.download.js.map