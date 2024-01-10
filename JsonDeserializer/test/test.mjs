import { JsonDeserializer } from "../JsonDeserializer.mjs";
(async () => {
    const source = (s) => new ReadableStream({
        start(controller) {
            controller.enqueue(s);
            controller.close();
        }
    });
    const logging = () => new WritableStream({
        write(chunk) {
            console.log(chunk);
        }
    });
    console.log("=== JSON ===");
    const json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]';
    await source(json)
        .pipeThrough(new JsonDeserializer().transform())
        .pipeTo(logging());
    console.log("=== JSON Lines ===");
    const jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}';
    await source(jsonl)
        .pipeThrough(new JsonDeserializer({ lineSeparated: true }).transform())
        .pipeTo(logging());
    console.log("Test completed.");
})();
//# sourceMappingURL=test.mjs.map