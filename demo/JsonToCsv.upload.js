import * as streams from "../mod.js";
import { DownloadStream } from "../DownloadStream/DownloadStream.js";
const chkDirect = document.getElementById("chkDirect");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.lastElementChild;
txtFile.onchange = async () => {
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
//# sourceMappingURL=JsonToCsv.upload.js.map