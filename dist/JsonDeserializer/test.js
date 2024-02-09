import { JsonDeserializer } from "./JsonDeserializer.js";
import { sleep } from "../funcs/sleep/sleep.js";
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
const deserializer = async (options, native) => native ? (await new JsonDeserializer(options).nativization()).transform() : new JsonDeserializer(options).transform();
const json = '[	\r\n{"a":1,"b":2}	,\r\n{"a":3,"b":4},{"a":5,"b":6}	,\r\n]';
const jsonl = '{"a":1,"b":2}\n{"a":3	,"b":4}\r\n{"a":5,"b":6}';
const bigJson = (count) => {
  const a = [];
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}');
  }
  return "[" + a.join(",") + "]";
};
const bigJsonLine = (count) => {
  const a = [];
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}');
  }
  return a.join("\n");
};
const test = async (native) => {
  console.group("JSON");
  {
    await source(json).pipeThrough(await deserializer(void 0, native)).pipeTo(logging());
  }
  console.groupEnd();
  console.group("JSON Lines");
  {
    await source(jsonl).pipeThrough(await deserializer({ lineSeparated: true }, native)).pipeTo(logging());
  }
  console.groupEnd();
  await sleep(0);
  console.group("Performance test");
  {
    const count = 1e5;
    console.log("count", count);
    const json2 = bigJson(count);
    const jsonl2 = bigJsonLine(count);
    console.group("JSON");
    await time(async () => {
      await source(json2).pipeThrough(await deserializer(void 0, native)).pipeTo(terminate());
    });
    console.groupEnd();
    await sleep(0);
    console.group("JSON Lines");
    await time(async () => {
      await source(jsonl2).pipeThrough(await deserializer({ lineSeparated: true }, native)).pipeTo(terminate());
    });
    console.groupEnd();
  }
  console.groupEnd();
  await sleep(0);
};
console.group("Pure JavaScript");
await test(false);
console.groupEnd();
console.group("WebAssembly");
await test(true);
console.groupEnd();
console.log("Test completed.");
//# sourceMappingURL=test.js.map
