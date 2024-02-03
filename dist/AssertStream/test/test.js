"use strict";import{AssertStream as a}from"../AssertStream.js";const o=e=>new ReadableStream({start(t){t.enqueue(e),t.close()}}),r=()=>new WritableStream;await o([1,2,3,4,5]).pipeThrough(new a(e=>e<=4)).pipeTo(r()),console.log("Test completed.");
//# sourceMappingURL=test.js.map
