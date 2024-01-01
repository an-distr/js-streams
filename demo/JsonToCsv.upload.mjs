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
const txtFile = document.getElementById("txtFile");
txtFile.onchange = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!txtFile.files) {
        return;
    }
    txtFile.files[0].stream()
        .pipeThrough(new TextDecoderStream)
        .pipeThrough(new streams.JsonDeserializerStream({ lineSeparated: txtFile.name.includes(".jsonl") }))
        .pipeThrough(new streams.CsvLineEncoderStream({ withNewLine: true }))
        .pipeTo(new DownloadStream("download.csv"));
});
//# sourceMappingURL=JsonToCsv.upload.mjs.map