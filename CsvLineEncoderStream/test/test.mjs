var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CsvLineEncoderStream } from "../CsvLineEncoderStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (data) => new ReadableStream({
        start(controller) {
            for (const chunk of data) {
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });
    const logger = () => new TransformStream({
        transform(chunk, controller) {
            console.log(chunk);
            controller.enqueue(chunk);
        }
    });
    const data = [
        { "a": 1, "b": 2, "c": "aaa\nbbb,ccc" },
        { "a": 4, "b": 5, "c": 6 },
        { "a": 7, "b": 8, "c": 9 },
        { "c1": "a", "c2": "b", "c3": "c", "c4": "d" },
    ];
    console.groupCollapsed("=== escape: all ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ escape: "all" }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("=== escape: auto ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ escape: "auto" }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("=== escape: none ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ escape: "none" }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("=== escape: custom ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ escape: s => `[${s}]` }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("=== delimiter: custom ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ delimiter: "|" }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("=== newLine: custom ===");
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ newLine: "|" }))
        .pipeThrough(logger())
        .pipeTo(new WritableStream);
    console.groupEnd();
    console.groupCollapsed("\n=== no new line ===");
    let text = "";
    yield readable(data)
        .pipeThrough(new CsvLineEncoderStream({ withNewLine: false }))
        .pipeTo(new WritableStream({
        write(chunk) {
            text += chunk;
        }
    }));
    console.log(text);
    console.groupEnd();
    console.log("\nTest completed.");
}))();
//# sourceMappingURL=test.mjs.map