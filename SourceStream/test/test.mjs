var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SourceStream } from "../SourceStream.mjs";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const logger = () => new TransformStream({
        transform(chunk, controller) {
            console.log(chunk);
            controller.enqueue(chunk);
        }
    });
    const terminator = () => new WritableStream;
    function test(data, strategy) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            console.groupCollapsed(`=== data: ${(_a = JSON.stringify(data)) === null || _a === void 0 ? void 0 : _a.slice(0, 25)}, strategy: ${JSON.stringify(strategy)} ===`);
            yield new SourceStream(data, strategy)
                .pipeThrough(logger())
                .pipeTo(terminator());
            console.groupEnd();
        });
    }
    yield test(undefined);
    yield test(null);
    yield test("abc");
    yield test(123);
    console.groupCollapsed("=== Array[object] ===");
    const arrayObject = [
        { a: 1 },
        { a: 1, b: 2 },
        { a: 1, b: 2, c: 3 },
    ];
    yield test(arrayObject);
    console.groupEnd();
    console.groupCollapsed("=== Array[Array] ===");
    const arrayArray = [
        [1, 2, 3],
        [1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ];
    yield test(arrayArray);
    yield test(arrayArray, { highWaterMark: 2 });
    yield test(arrayArray, new CountQueuingStrategy({ highWaterMark: 2 }));
    console.groupEnd();
    console.groupCollapsed("=== Uint8Array ===");
    yield test(new Uint8Array(8192 * 3 + 100));
    yield test(new Uint8Array(8192 * 3 + 100), { highWaterMark: 8192 });
    yield test(new Uint8Array(8192 * 3 + 100), new ByteLengthQueuingStrategy({ highWaterMark: 5000 }));
    console.groupEnd();
    console.groupCollapsed("=== Int32Array ===");
    yield test(new Int32Array(8192 * 3 + 100));
    yield test(new Int32Array(8192 * 3 + 100), { highWaterMark: 8192 });
    yield test(new Int32Array(8192 * 3 + 100), new ByteLengthQueuingStrategy({ highWaterMark: 5000 }));
    console.groupEnd();
    console.log("Test completed.");
}))();
//# sourceMappingURL=test.mjs.map