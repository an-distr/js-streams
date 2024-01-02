var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ArrayAccumulatorStream } from "../ArrayAccumulatorStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (data) => new ReadableStream({
        start(controller) {
            if (Array.isArray(data)) {
                for (const chunk of data) {
                    controller.enqueue(chunk);
                }
            }
            else {
                controller.enqueue(data);
            }
            controller.close();
        }
    });
    const logging = () => new TransformStream({
        transform(chunk, controller) {
            console.log(chunk);
            controller.enqueue(chunk);
        }
    });
    const writable = () => new WritableStream;
    const test = (data, count) => __awaiter(void 0, void 0, void 0, function* () {
        console.groupCollapsed(`=== data: ${JSON.stringify(data)}, count: ${count} ===`);
        yield readable(data)
            .pipeThrough(new ArrayAccumulatorStream(count))
            .pipeThrough(logging())
            .pipeTo(writable());
        console.groupEnd();
    });
    yield test(undefined, 2);
    yield test(null, 2);
    yield test("abc", 2);
    yield test(123, 2);
    yield test([1, 2, 3, 4, 5], 2);
    yield test([{ a: 1 }, { a: 2 }, { a: 3 }, { a: 4 }, { a: 5 },], 2);
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map