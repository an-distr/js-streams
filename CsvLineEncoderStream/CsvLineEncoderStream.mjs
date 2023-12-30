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
export class CsvLineEncoderStream extends TransformStream {
    constructor(options) {
        var _a, _b, _c, _d;
        const keys = new Map();
        const delimiter = (_a = options === null || options === void 0 ? void 0 : options.delimiter) !== null && _a !== void 0 ? _a : ",";
        const escape = (_b = options === null || options === void 0 ? void 0 : options.escape) !== null && _b !== void 0 ? _b : "auto";
        const withNewLine = (_c = options === null || options === void 0 ? void 0 : options.withNewLine) !== null && _c !== void 0 ? _c : true;
        const newLine = withNewLine ? ((_d = options === null || options === void 0 ? void 0 : options.newLine) !== null && _d !== void 0 ? _d : "\n") : "";
        const doEscape = typeof escape !== "string"
            ? escape
            : escape === "auto"
                ? (s) => {
                    if (s.includes("\"") || s.includes("\n")) {
                        return "\"" + s.replace(/\"/g, "\"\"") + "\"";
                    }
                    return s;
                }
                : escape === "all"
                    ? (s) => "\"" + s.replace(/\"/g, "\"\"") + "\""
                    : (s) => s;
        super({
            transform(chunk, controller) {
                let values;
                if (Array.isArray(chunk)) {
                    values = chunk;
                }
                else {
                    values = [chunk];
                }
                for (const value of values) {
                    const key_ = Object.keys(value).join(",");
                    if (!keys.has(key_)) {
                        const keys_ = [];
                        for (const key in value) {
                            keys_.push(key);
                        }
                        keys.set(key_, keys_);
                    }
                    const line = keys.get(key_)
                        .map(key => value[key])
                        .map(o => { var _a; return (_a = o === null || o === void 0 ? void 0 : o.toString()) !== null && _a !== void 0 ? _a : ""; })
                        .map(doEscape)
                        .join(delimiter);
                    controller.enqueue(line + newLine);
                }
            }
        });
    }
}
//# sourceMappingURL=CsvLineEncoderStream.mjs.map