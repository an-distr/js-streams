import { CsvLineEncoder } from "../CsvLineEncoder.js";
(async () => {
    const source = (data) => new ReadableStream({
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
    const terminate = () => new WritableStream;
    const data = [
        { "a": 1, "b": 2, "c": "aaa\nbbb,ccc" },
        { "a": 4, "b": 5, "c": 6 },
        { "a": 7, "b": 8, "c": 9 },
        { "c1": "a", "c2": "b", "c3": "c", "c4": "d" },
    ];
    console.groupCollapsed("=== escape: all ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ escape: "all" }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("=== escape: auto ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ escape: "auto" }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("=== escape: none ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ escape: "none" }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("=== escape: custom ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ escape: s => `[${s}]` }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("=== delimiter: custom ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ delimiter: "|" }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("=== newLine: custom ===");
    await source(data)
        .pipeThrough(new CsvLineEncoder({ newLine: "|" }).transform())
        .pipeThrough(logging())
        .pipeTo(terminate());
    console.groupEnd();
    console.groupCollapsed("\n=== no new line ===");
    let text = "";
    await source(data)
        .pipeThrough(new CsvLineEncoder({ withNewLine: false }).transform())
        .pipeTo(new WritableStream({
        write(chunk) {
            text += chunk;
        }
    }));
    console.log(text);
    console.groupEnd();
    console.log("\nTest completed.");
})();
//# sourceMappingURL=test.js.map