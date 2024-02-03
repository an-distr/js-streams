"use strict";import{JsonDeserializer as a}from"../JsonDeserializer.js";(async()=>{const o=e=>new ReadableStream({start(s){s.enqueue(e),s.close()}}),n=()=>new WritableStream({write(e){console.log(e)}});console.log("=== JSON ==="),await o('[{"a":1,"b":2},{"a":3,"b":4},{"a":5,"b":6}]').pipeThrough(new a().transform()).pipeTo(n()),console.log("=== JSON Lines ==="),await o(`{"a":1,"b":2}
{"a":3,"b":4}
{"a":5,"b":6}`).pipeThrough(new a({lineSeparated:!0}).transform()).pipeTo(n()),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map
