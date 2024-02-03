"use strict";import{PeekStream as c}from"../PeekStream.js";(async()=>{const t=o=>new ReadableStream({start(e){for(const s of o)e.enqueue(s);e.close()}}),a=()=>new c((o,e)=>{console.log(e,o)}),n=()=>new WritableStream;await t([[1,2,3],[1,2,3,4,5,6],[1,2,3,4,5,6,7,8,9]]).pipeThrough(a()).pipeTo(n()),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map
