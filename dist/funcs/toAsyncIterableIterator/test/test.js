"use strict";
import { toAsyncIterableIterator } from "../toAsyncIterableIterator.js";
const source = (vals) => new ReadableStream({
  start(controller) {
    for (const val of vals) {
      controller.enqueue(val);
    }
    controller.close();
  }
});
const test = async (vals) => {
  console.group("vals:", vals.length > 10 ? `${vals.splice(0, 10)}...` : vals);
  const readable = source(vals);
  let i = 0;
  for await (const val of toAsyncIterableIterator(readable)) {
    console.assert(val === vals[i]);
    ++i;
  }
  console.groupEnd();
};
await test([]);
await test([1, 2, 3, 4, 5]);
await test(["a", "b", "c", "d", "e"]);
await test([1, void 0, null, "a", 0.1]);
const big = [];
for (let i = 0; i < 1e5; ++i)
  big.push(i);
await test(big);
console.log("Test completed.");
//# sourceMappingURL=test.js.map
