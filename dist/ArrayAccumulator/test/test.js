"use strict";import{ArrayAccumulator as r}from"../ArrayAccumulator.js";import{CompatiblePerformance as v}from"../../misc/CompatiblePerformance/CompatiblePerformance.js";import{sleep as i}from"../../funcs/sleep/sleep.js";(async()=>{v.replaceIfUnsupported();const l=e=>new ReadableStream({start(a){a.enqueue(e),a.close()}}),u=()=>new TransformStream({transform(e,a){console.log(e),a.enqueue(e)}}),f=()=>new WritableStream,m=async(e,a)=>{const o=new r(e);await o.push(a);for await(const n of o.flush())console.log(n)},p=async(e,a)=>{const o=new r(e);for await(const n of o.flush(a))console.log(n)},d=async(e,a)=>{const o=new r(e);await o.push(a);for await(const n of o)console.log(n)},y=async(e,a)=>{await new r(e).readable(a).pipeThrough(u()).pipeTo(f())},g=async(e,a)=>{const o=new r(e);await l(a).pipeThrough(o.transform()).pipeThrough(u()).pipeTo(f())},w=async(e,a)=>{const o=new r(e);await l(a).pipeTo(o.writable());for await(const n of o)console.log(n)},s=async(e,a)=>{console.groupCollapsed(`size=${e}, total=${a}`),performance.clearMeasures("perf"),performance.clearMarks("start"),performance.clearMarks("end"),performance.mark("start");const o=new r(e);for(let t=0;t<a;++t)for await(const c of o.pull(t))console.assert(c.length===e,"flush= false","value=",c,"length=",c.length,"size=",e);for await(const t of o.flush())console.assert(t.length===a%e,"flush= true","value=",t,"length=",t.length,"size=",a%e);performance.mark("end"),performance.measure("perf","start","end");const n=performance.getEntriesByName("perf")[0];console.log(`duration: ${n.duration}`),console.groupEnd(),await i(0)},b=[{name:"Push",func:m},{name:"Flush",func:p},{name:"AsyncIterator",func:d},{name:"Readable",func:y},{name:"Transform",func:g},{name:"Writable",func:w}],h=[4,5,6],T=[void 0,null,"abc",123,1.23,[1,2,3,4,5],["aaa","bbb","ccc","ddd","eee"],[{a:1},{b:2},{c:3},{d:4},{e:5}],function*(){yield 1,yield 2,yield 3,yield 4,yield 5},async function*(){yield 1,yield 2,yield 3,yield 4,yield 5}];for(const e of b){console.groupCollapsed(e.name);for(const a of T)for(const o of h)console.groupCollapsed(`size=${o}, data=${JSON.stringify(a)}`),await e.func(o,a),console.groupEnd(),await i(0);console.groupEnd()}console.groupCollapsed("Performance"),await s(8,1e5),await s(32,1e5),await s(1e3,1e5),console.groupEnd(),console.log("Test completed.")})();
//# sourceMappingURL=test.js.map
