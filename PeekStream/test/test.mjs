import { PeekStream } from "../PeekStream.mjs";
(async () => {
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
    await readable(data)
        .pipeThrough(logger())
        .pipeTo(terminator());
    console.log("Test completed.");
})();
//# sourceMappingURL=test.mjs.map