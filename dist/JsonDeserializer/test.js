import { JsonDeserializer } from "./JsonDeserializer.js";
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
const terminate = () => new WritableStream();
const time = async (fn) => {
  performance.clearMarks("start");
  performance.clearMarks("end");
  performance.clearMeasures("perf");
  performance.mark("start");
  await fn();
  performance.mark("end");
  performance.measure("perf", "start", "end");
  const perf = performance.getEntriesByName("perf")[0];
  console.log(perf.duration);
};
console.group("JSON");
let json = '[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]';
await source(json).pipeThrough(new JsonDeserializer().transform()).pipeTo(logging());
console.groupEnd();
console.group("JSON Lines");
let jsonl = '{"a":1,"b":2}\n{"a":3,"b":4}\n{"a":5,"b":6}';
await source(jsonl).pipeThrough(new JsonDeserializer({ lineSeparated: true }).transform()).pipeTo(logging());
console.groupEnd();
console.group("Performance tests");
{
  const count = 1e5;
  console.log("count", count);
  json = "[" + '{"a":1,"b":2},'.repeat(count);
  json = json.slice(0, -1) + "]";
  jsonl = '{"a":1,"b":2}\n'.repeat(count);
  console.group("JSON(js)");
  await time(async () => {
    await source(json).pipeThrough(new JsonDeserializer().transform()).pipeTo(terminate());
  });
  console.groupEnd();
  console.group("JSON Lines(js)");
  await time(async () => {
    await source(json).pipeThrough(new JsonDeserializer({ lineSeparated: true }).transform()).pipeTo(terminate());
  });
  console.groupEnd();
  console.group("JSON(wasm)");
  await time(async () => {
    await source(json).pipeThrough((await new JsonDeserializer().nativization()).transform()).pipeTo(terminate());
  });
  console.groupEnd();
  console.group("JSON Lines(wasm)");
  await time(async () => {
    await source(json).pipeThrough((await new JsonDeserializer({ lineSeparated: true }).nativization()).transform()).pipeTo(terminate());
  });
  console.groupEnd();
}
console.groupEnd();
console.log("Test completed.");
//# sourceMappingURL=test.js.map
