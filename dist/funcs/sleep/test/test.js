"use strict";import{sleep as o}from"../sleep.js";(async()=>{const e=async r=>{console.group(`Wait for ${r} second(s).`),performance.clearMarks("start"),performance.clearMarks("end"),performance.clearMeasures("perf"),performance.mark("start"),await o(r),performance.mark("end"),performance.measure("perf","start","end");const a=performance.getEntriesByName("perf");console.log(`elapsed: ${a[0].duration} msec(s).`),console.groupEnd()};await e(1e3),await e(1),await e(),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map