import { JsonSerializer } from "./JsonSerializer.js";
const source = (data) => new ReadableStream({
  start(controller) {
    controller.enqueue(data);
    controller.close();
  }
});
const logging = () => new WritableStream({
  write(chunk) {
    console.log(chunk);
  }
});
const objs = [
  { a: 1, b: 2 },
  { a: 3, b: 4 },
  { a: 5, b: 6 }
];
console.log("=== JSON ===");
await source(objs).pipeThrough(new JsonSerializer().transformable()).pipeTo(logging());
console.log("=== JSON Lines ===");
await source(objs).pipeThrough(new JsonSerializer({ lineSeparated: true }).transformable()).pipeTo(logging());
console.log("Test completed.");
//# sourceMappingURL=test.js.map
