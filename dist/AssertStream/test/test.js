"use strict";
import { AssertStream } from "../AssertStream.js";
const source = (data) => new ReadableStream({
  start(controller) {
    controller.enqueue(data);
    controller.close();
  }
});
const terminate = () => new WritableStream();
await source([1, 2, 3, 4, 5]).pipeThrough(new AssertStream((chunk) => chunk <= 4)).pipeTo(terminate());
console.log("Test completed.");
//# sourceMappingURL=test.js.map
