var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JsonDeserializerStream } from "../JsonDeserializerStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (s) => new ReadableStream({
        start(controller) {
            controller.enqueue(s);
            controller.close();
        }
    });
    const logger = () => new WritableStream({
        write(chunk) {
            console.log(chunk);
        }
    });
    console.log("=== JSON ===");
    const json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]';
    yield readable(json)
        .pipeThrough(new JsonDeserializerStream)
        .pipeTo(logger());
    console.log("=== JSON Lines ===");
    const jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}';
    yield readable(jsonl)
        .pipeThrough(new JsonDeserializerStream({ lineSeparated: true }))
        .pipeTo(logger());
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map