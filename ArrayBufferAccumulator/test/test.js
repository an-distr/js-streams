import { ArrayBufferAccumulator } from "../ArrayBufferAccumulator.js";
import { CompatiblePerformance } from "../../misc/CompatiblePerformance/CompatiblePerformance.js";
import { PerformanceStreamBuilder } from "../../PerformanceStream/PerformanceStream.js";
import { Utf8DecoderStream, Utf8EncoderStream } from "../../Utf8Streams/Utf8Streams.js";
(async () => {
    CompatiblePerformance.replaceIfUnsupported();
    function source(totalSize, chunkSize, isArray) {
        return new ReadableStream({
            start(controller) {
                const bytes = new ArrayBuffer(totalSize);
                const count = bytes.byteLength / chunkSize;
                for (let i = 0; i < count; ++i) {
                    const bytesView = new Uint8Array(bytes.slice(i * chunkSize, i * chunkSize + chunkSize));
                    if (isArray) {
                        const array = Array.from(bytesView.values());
                        controller.enqueue(array);
                    }
                    else {
                        controller.enqueue(bytesView);
                    }
                }
                controller.close();
            }
        });
    }
    function results(result) {
        return new WritableStream({
            write(chunk) {
                if (Array.isArray(chunk)) {
                    result.sizeOfWritten += chunk.length;
                }
                else {
                    result.sizeOfWritten += chunk.byteLength;
                }
            }
        });
    }
    function assertChunkSize(totalSize, chunkSize) {
        return new TransformStream({
            transform(chunk, controller) {
                let length;
                if (Array.isArray(chunk)) {
                    length = chunk.length;
                }
                else {
                    length = chunk.byteLength;
                }
                console.assert([
                    totalSize,
                    chunkSize,
                    totalSize - (chunkSize * Math.floor(totalSize / chunkSize)),
                ].indexOf(length) !== -1, {
                    receivedChunkSize: length,
                });
                controller.enqueue(chunk);
            }
        });
    }
    const test = async (totalSize, readableChunkSize, chunkSize, fixed, isArray) => {
        readableChunkSize = readableChunkSize === 0 ? totalSize : readableChunkSize;
        const ps = new PerformanceStreamBuilder("ArrayBufferAccumulator", "start", "end");
        const result = { sizeOfWritten: 0 };
        await source(totalSize, readableChunkSize, isArray)
            .pipeThrough(ps
            .pipe(new ArrayBufferAccumulator(chunkSize, { fixed }).transform())
            .pipe(assertChunkSize(totalSize, chunkSize))
            .build())
            .pipeTo(results(result));
        const psResult = ps.result();
        console.assert(psResult !== undefined);
        console.groupCollapsed([
            `ReadableStream(${totalSize.toLocaleString()}, { isArray: ${isArray} }) =>`,
            `chunk(${readableChunkSize.toLocaleString()}) =>`,
            `ArrayBufferAccumulator(${chunkSize.toLocaleString()}, { fixed: ${fixed} })`,
            `durationOfOccupancy: ${psResult.occupancy}`,
        ].join(" "));
        console.assert((fixed
            ? chunkSize * Math.ceil(totalSize / chunkSize)
            : totalSize) === result.sizeOfWritten, {
            sizeOfWritten: result.sizeOfWritten,
        });
        console.table({
            totalSize,
            readableChunkSize,
            chunkSize,
            sizeOfWritten: result.sizeOfWritten,
            transforming: psResult.transforming,
            durationOfOccupancy: psResult.occupancy,
            durationMinimum: psResult.min,
            durationMaximum: psResult.max,
            durationAverage: psResult.average,
            durationMedian: psResult.median,
        });
        console.groupEnd();
    };
    const testNewLine = async (chunkSize) => {
        const text = "aaaaaaaaaa\nbbbbbbbbbb\ncccccccccc\ndddddddddd\neeeeeeeeee\n11111";
        const readable = new ReadableStream({
            start(controller) {
                controller.enqueue(text);
                controller.close();
            }
        });
        const writable = new WritableStream({
            write(chunk) {
                console.log(`[${chunk}]`);
            }
        });
        await readable
            .pipeThrough(new Utf8EncoderStream)
            .pipeThrough(new ArrayBufferAccumulator(chunkSize, { forceEmit: [[10, 13], [13], [10]] }).transform())
            .pipeThrough(new Utf8DecoderStream)
            .pipeTo(writable);
    };
    await source(1, 1, false)
        .pipeThrough(new ArrayBufferAccumulator(1).transform())
        .pipeTo(new WritableStream);
    const totalSizes = [
        1,
        1000,
        1 * 1024 * 1024,
    ];
    const readableChunkSizes = [
        64,
        1000,
        8192,
        8192 * 10,
        0,
    ];
    const chunkSizes = [
        128,
        256,
        512,
        1000,
        8192,
    ];
    console.groupCollapsed("Testing ArrayBuffer|Array");
    for (const totalSize of totalSizes) {
        console.groupCollapsed(`totalSize: ${totalSize}`);
        for (const readableChunkSize of readableChunkSizes) {
            for (const chunkSize of chunkSizes) {
                for (const fixed of [false, true]) {
                    for (const isArray of [false, true]) {
                        await test(totalSize, readableChunkSize, chunkSize, fixed, isArray);
                    }
                }
            }
        }
        console.groupEnd();
    }
    console.groupEnd();
    console.groupCollapsed("Testing line separate");
    console.groupCollapsed("> size");
    await testNewLine(8);
    console.groupEnd();
    console.groupCollapsed("= size");
    await testNewLine(10);
    console.groupEnd();
    console.groupCollapsed("< size");
    await testNewLine(13);
    console.groupEnd();
    console.groupEnd();
    console.log("Test completed.");
})();
//# sourceMappingURL=test.js.map