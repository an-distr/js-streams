"use strict";import{PeekStream as n}from"../PeekStream.js";const a=o=>new ReadableStream({start(e){for(const t of o)e.enqueue(t);e.close()}}),s=()=>new n((o,e)=>{console.log(e,o)}),c=()=>new WritableStream,r=[[1,2,3],[1,2,3,4,5,6],[1,2,3,4,5,6,7,8,9]];await a(r).pipeThrough(s()).pipeTo(c()),console.log("Test completed.");
//# sourceMappingURL=test.js.map
