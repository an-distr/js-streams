import { JsonSerializerStream } from "../JsonSerializerStream.mjs";
(async () => {
    const readable = (data) => new ReadableStream({
        start(controller) {
            for (const chunk of data) {
                controller.enqueue(chunk);
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
    await readable(objs)
        .pipeThrough(new JsonSerializerStream)
        .pipeTo(logger());
    console.log("=== JSON Lines ===");
    await readable(objs)
        .pipeThrough(new JsonSerializerStream({ lineSeparated: true }))
        .pipeTo(logger());
    console.log("Test completed.");
})();
//# sourceMappingURL=test.mjs.map