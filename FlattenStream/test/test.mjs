var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FlattenStream } from "../FlattenStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const readable = (data) => new ReadableStream({
        start(controller) {
            controller.enqueue(data);
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
    const test = (data, limit) => __awaiter(void 0, void 0, void 0, function* () {
        console.groupCollapsed(`=== data: ${JSON.stringify(data)}, limit: ${limit} ===`);
        yield readable(data)
            .pipeThrough(new FlattenStream(limit))
            .pipeThrough(logging())
            .pipeTo(writable());
        console.groupEnd();
    });
    yield test(undefined);
    yield test(null);
    yield test("abc");
    yield test(123);
    yield test([1, 2, 3, 4, 5]);
    yield test([{ a: 1 }, { a: 2 }, [{ a: 3 }, [{ a: 4 }]], { a: 5 }]);
    yield test([0, [1, [2, [3]]]]);
    yield test([0, [1, [2, [3]]]], 0);
    yield test([0, [1, [2, [3]]]], 1);
    yield test([0, [1, [2, [3]]]], 2);
    yield test([0, [1, [2, [3]]]], 3);
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map