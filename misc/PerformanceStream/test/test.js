import { PerformanceStream } from "../PerformanceStream.js";
(async () => {
    const source = () => new ReadableStream({
        start(controller) {
            for (const n of [1, 2, 3, 4, 5]) {
                controller.enqueue(n);
            }
            controller.close();
        }
    });
    const terminate = () => new WritableStream({
        write(chunk) {
            console.log(`writed: ${chunk}`);
            console.groupEnd();
        }
    });
    const grouping = () => new TransformStream({
        transform(chunk, controller) {
            console.group(`chunk=${chunk}`);
            controller.enqueue(chunk);
        }
    });
    const transform = (name) => new TransformStream({
        async transform(chunk, controller) {
            console.log(`chunk=${chunk}, name=${name}`);
            await new Promise(resolve => setTimeout(resolve, 100));
            controller.enqueue(chunk);
        }
    });
    const ps = new PerformanceStream("perf", "start", "end");
    await source()
        .pipeThrough(grouping())
        .pipeThrough(ps
        .pipe(transform("transform 1"))
        .pipe(transform("transform 2"))
        .pipe(transform("transform 3"))
        .build())
        .pipeTo(terminate());
    console.table(ps.result());
})();
//# sourceMappingURL=test.js.map