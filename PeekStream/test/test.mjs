var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PeekStream } from "../PeekStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (data) => new ReadableStream({
        start(controller) {
            for (const chunk of data) {
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });
    const logger = () => new PeekStream((chunk, index) => {
        console.log(index, chunk);
    });
    const terminator = () => new WritableStream;
    const data = [
        [1, 2, 3],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ];
    yield readable(data)
        .pipeThrough(logger())
        .pipeTo(terminator());
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map