import { JsonDeserializer } from "./JsonDeserializer.js";
import { SimplePerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.js";
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
const testPerformance = async (data, options) => {
  const builder = new SimplePerformanceStreamBuilder();
  await source(data).pipeThrough(builder.pipe(deserializer(options)).build()).pipeTo(terminate());
  console.table(builder.result());
};
const deserializer = (options) => new JsonDeserializer(options).transformable();
const json = '[	\r\n{"a":1,"b":2}	,\r\n{"a":3,"b":4\r},{"a":5,"b":6}	,\r\n]';
const jsonl = '{"a":1,"b"  :2 }\n{"a":3	,"b"	:4}\r\n{"a":5,"b":6}\r';
const jsonc = `[	\r
{"a":1,"b":2/* test
abc*/\r}	,\r
{"a":3,"b":4}, // test
{"a":5,"b":6}	,\r
]`;
const bigJson = (count) => {
  const a = [];
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}');
  }
  return "[" + a.join(",") + "]";
};
const bigJsonLines = (count) => {
  const a = [];
  for (let i = 0; i < count; ++i) {
    a.push('{"a":1,"b":2}');
  }
  return a.join("\n");
};
const bigJsonWithComments = (count) => {
  const a = [];
  for (let i = 0; i < count; ++i) {
    a.push(`{"a":1/* test
    abc */,"b":2} // test
    `);
  }
  return "[" + a.join(",") + "]";
};
const test = async () => {
  console.group("JSON");
  {
    await source(json).pipeThrough(deserializer(void 0)).pipeTo(logging());
  }
  console.groupEnd();
  console.group("JSON Lines");
  {
    await source(jsonl).pipeThrough(deserializer({ lineSeparated: true })).pipeTo(logging());
  }
  console.groupEnd();
  console.group("JSON with comments");
  {
    await source(jsonc).pipeThrough(deserializer({ withComments: true })).pipeTo(logging());
  }
  console.groupEnd();
  await sleep();
  console.group("Performance test");
  {
    const count = 1e5;
    console.log("count", count);
    const json2 = bigJson(count);
    const jsonl2 = bigJsonLines(count);
    const jsonc2 = bigJsonWithComments(count);
    console.group("JSON");
    await testPerformance(json2);
    console.groupEnd();
    await sleep();
    console.group("JSON Lines");
    await testPerformance(jsonl2, { lineSeparated: true });
    console.groupEnd();
    await sleep();
    console.group("JSON with comments");
    await testPerformance(jsonc2, { withComments: true });
    console.groupEnd();
  }
  console.groupEnd();
  await sleep();
};
console.group("JsonDeserializer");
await test();
console.groupEnd();
console.log("Test completed.");
//# sourceMappingURL=test.js.map
