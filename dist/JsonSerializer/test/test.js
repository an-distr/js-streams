"use strict";import{JsonSerializer as t}from"../JsonSerializer.js";(async()=>{const o=e=>new ReadableStream({start(s){s.enqueue(e),s.close()}}),a=()=>new WritableStream({write(e){console.log(e)}}),n=[{a:1,b:2},{a:3,b:4},{a:5,b:6}];console.log("=== JSON ==="),await o(n).pipeThrough(new t().transform()).pipeTo(a()),console.log("=== JSON Lines ==="),await o(n).pipeThrough(new t({lineSeparated:!0}).transform()).pipeTo(a()),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map
