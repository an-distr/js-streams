import * as streams from "../mod.mjs";
import { DownloadStream } from "../DownloadStream/DownloadStream.mjs";
const chkDirect = document.getElementById("chkDirect");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.querySelector("div");
txtFile.onchange = async () => {
    linkHolder.innerHTML = "";
    if (!txtFile.files) {
        return;
    }
    let options;
    if (!chkDirect.checked) {
        options = {
            linkHolder
        };
    }
    txtFile.files[0].stream()
        .pipeThrough(new streams.Utf8DecoderStream)
        .pipeThrough(new streams.JsonDeserializer({ lineSeparated: txtFile.name.includes(".jsonl") }).transform())
        .pipeThrough(new streams.CsvLineEncoder({ withNewLine: true }).transform())
        .pipeTo(new DownloadStream("download.csv", options));
};
//# sourceMappingURL=JsonToCsv.upload.mjs.map