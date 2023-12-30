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
function readable() {
    return new ReadableStream({
        start(controller) {
            controller.enqueue(Uint8Array.from([1, 2, 3]));
            controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6]));
            controller.enqueue(Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]));
            controller.close();
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield readable()
        .pipeThrough(new PeekStream((chunk, index) => console.log(`${index}: size=${chunk.byteLength}`)))
        .pipeTo(new WritableStream);
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map