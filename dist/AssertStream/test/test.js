"use strict";import{AssertStream as s}from"../AssertStream.js";(async()=>{const a=e=>new ReadableStream({start(t){t.enqueue(e),t.close()}}),o=()=>new WritableStream;await a([1,2,3,4,5]).pipeThrough(new s(e=>e<=4)).pipeTo(o()),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map
