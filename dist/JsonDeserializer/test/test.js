"use strict";import{JsonDeserializer as n}from"../JsonDeserializer.js";const a=e=>new ReadableStream({start(o){o.enqueue(e),o.close()}}),s=()=>new WritableStream({write(e){console.log(e)}});console.log("=== JSON ===");const t='[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]';await a(t).pipeThrough(new n().transform()).pipeTo(s()),console.log("=== JSON Lines ===");const r=`{"a":1,"b":2}
{"a":3,"b":4}
{"a":5,"b":6}`;await a(r).pipeThrough(new n({lineSeparated:!0}).transform()).pipeTo(s()),console.log("Test completed.");
//# sourceMappingURL=test.js.map
