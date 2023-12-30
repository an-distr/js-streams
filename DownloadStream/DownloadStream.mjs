/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class DownloadStream extends WritableStream {
    constructor(name) {
        let directory;
        let handle;
        let fileStream;
        super({
            start() {
                return __awaiter(this, void 0, void 0, function* () {
                    directory = yield navigator.storage.getDirectory();
                    handle = yield directory.getFileHandle(name, { create: true });
                    fileStream = yield handle.createWritable();
                });
            },
            write(chunk) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield fileStream.write(chunk);
                });
            },
            close() {
                return __awaiter(this, void 0, void 0, function* () {
                    yield fileStream.close();
                    const file = yield handle.getFile();
                    const url = URL.createObjectURL(file);
                    const trigger = document.createElement("a");
                    trigger.href = url;
                    trigger.target = "_blank";
                    trigger.download = name;
                    trigger.click();
                    trigger.remove();
                    setTimeout(() => URL.revokeObjectURL(url), 10 * 1000);
                });
            },
            abort(reason) {
                return __awaiter(this, void 0, void 0, function* () {
                    fileStream.abort(reason);
                    yield directory.removeEntry(name);
                });
            }
        });
    }
}
//# sourceMappingURL=DownloadStream.mjs.map