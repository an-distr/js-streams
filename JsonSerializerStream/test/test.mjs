var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JsonSerializerStream } from "../JsonSerializerStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (objs) => new ReadableStream({
        start(controller) {
            for (const obj of objs) {
                controller.enqueue(obj);
            }
            controller.close();
        }
    });
    const logger = () => new WritableStream({
        write(chunk) {
            console.log(chunk);
        }
    });
    const objs = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
        { a: 5, b: 6 },
    ];
    console.log("=== JSON ===");
    yield readable(objs)
        .pipeThrough(new JsonSerializerStream)
        .pipeTo(logger());
    console.log("=== JSON Lines ===");
    yield readable(objs)
        .pipeThrough(new JsonSerializerStream({ lineSeparated: true }))
        .pipeTo(logger());
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map