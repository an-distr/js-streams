import { Utf8DecoderStream, Utf8EncoderStream } from "../Utf8Streams.js";
(async () => {
    const source = () => new ReadableStream({
        start(controller) {
            controller.enqueue("abcdef");
            controller.close();
        }
    });
    const logging = (label) => new TransformStream({
        transform(chunk, controller) {
            console.log(label, chunk);
            controller.enqueue(chunk);
        }
    });
    const terminate = () => new WritableStream();
    await source()
        .pipeThrough(logging("Before Utf8EncoderStream"))
        .pipeThrough(new Utf8EncoderStream())
        .pipeThrough(logging("After Utf8EncoderStream"))
        .pipeThrough(new Utf8DecoderStream())
        .pipeThrough(logging("After Utf8DecoderStream"))
        .pipeTo(terminate());
})();
//# sourceMappingURL=test.js.map