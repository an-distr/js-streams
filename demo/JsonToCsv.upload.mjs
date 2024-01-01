var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as streams from "../mod.mjs";
import { DownloadStream } from "../DownloadStream/DownloadStream.mjs";
const chkDirect = document.getElementById("chkDirect");
const txtFile = document.getElementById("txtFile");
const linkHolder = txtFile.parentElement.querySelector("div");
txtFile.onchange = () => __awaiter(void 0, void 0, void 0, function* () {
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
        .pipeThrough(new TextDecoderStream)
        .pipeThrough(new streams.JsonDeserializerStream({ lineSeparated: txtFile.name.includes(".jsonl") }))
        .pipeThrough(new streams.CsvLineEncoderStream({ withNewLine: true }))
        .pipeTo(new DownloadStream("download.csv", options));
});
//# sourceMappingURL=JsonToCsv.upload.mjs.map