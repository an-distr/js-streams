import * as streams from "../mod.js";
import { DownloadStream } from "../DownloadStream/DownloadStream.js";
const chkDirect = document.getElementById("chkDirect");
const txtUrl = document.getElementById("txtUrl");
const btnConvertUrl = document.getElementById("btnConvertUrl");
const linkHolder = txtUrl.parentElement.querySelector("div");
btnConvertUrl.onclick = async () => {
    linkHolder.innerHTML = "";
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
            .pipeThrough(new streams.Utf8DecoderStream)
            .pipeThrough(new streams.JsonDeserializer({ lineSeparated: (_a = response.headers.get("content-type")) === null || _a === void 0 ? void 0 : _a.includes("jsonl") }).transform())
            .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
            .pipeTo(new DownloadStream("download.csv", options));
    });
};
//# sourceMappingURL=JsonToCsv.download.js.map