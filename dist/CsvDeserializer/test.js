import { CsvDeserializer } from "./CsvDeserializer.js";
import { PerformanceStreamBuilder } from "../PerformanceStream/PerformanceStream.js";
import { sleep } from "../funcs/sleep/sleep.js";
import { CompatiblePerformance } from "../misc/CompatiblePerformance/CompatiblePerformance.js";
globalThis.performance = new CompatiblePerformance();
const source = (source2) => new ReadableStream({
  start(controller) {
    for (const line of source2) {
      controller.enqueue(line);
    }
    controller.close();
  }
});
const logging = () => new TransformStream({
  transform(chunk, controller) {
    console.log(chunk);
    controller.enqueue(chunk);
  }
});
const terminate = () => new WritableStream();
const deserializer = (options) => new CsvDeserializer(options);
const csvHeaderLess = [
  'a,1,"b,2\\""',
  "c,3,d,4",
  "e,5,f\ng,6,h"
];
const csvHeaderIncluded = ["column1,column2,column3"].concat(csvHeaderLess);
const tsvHeaderLess = csvHeaderLess.map((x) => x.replace(/,/g, "	"));
const tsvHeaderIncluded = csvHeaderIncluded.map((x) => x.replace(/,/g, "	"));
const test = async (title, data, headers, delimiter) => {
  console.group(title);
  console.log("headers=", headers);
  console.log("data=", data);
  console.log("result=");
  await source(data).pipeThrough(deserializer({
    hasHeader: !headers || headers.length === 0,
    headers,
    delimiter
  }).transformable()).pipeThrough(logging()).pipeTo(terminate());
  console.groupEnd();
};
const testPerformance = async (columnCount, rowCount) => {
  console.group("columns=", columnCount, "rows=", rowCount);
  const rows = [];
  const fields = [];
  for (let i = 0; i < columnCount; ++i) {
    fields.push(`column${i + 1}`);
  }
  rows.push(fields.join(","));
  for (let i = 0; i < rowCount; ++i) {
    fields.length = 0;
    for (let j = 0; j < columnCount; ++j) {
      fields.push(`value${i + 1}_${j + 1}`);
    }
    rows.push(fields.join(","));
  }
  const builder = new PerformanceStreamBuilder("perf", "start", "end");
  await source(rows).pipeThrough(builder.pipe(deserializer({ hasHeader: true }).transformable()).build()).pipeTo(terminate());
  const perf = builder.result();
  console.table(perf);
  console.groupEnd();
};
console.group("Testing");
await test("CSV Header less", csvHeaderLess, ["c1", "c2"]);
await test("CSV Header included", csvHeaderIncluded);
await test("TSV Header less", tsvHeaderLess, ["c1", "c2"], "	");
await test("TSV Header included", tsvHeaderIncluded, void 0, "	");
console.groupEnd();
await sleep();
console.group("Testing performance");
await testPerformance(100, 1e5);
console.groupEnd();
console.log("Test completed.");
//# sourceMappingURL=test.js.map
