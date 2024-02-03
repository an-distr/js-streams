"use strict";/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/export class CompatiblePerformance{constructor(){this.navigation={};this.timeOrigin=0;this.timing={};this.eventCounts={};this.onresourcetimingbufferfull=()=>null;this.entries=new Map,this.now_impl=globalThis.performance.now??(()=>Date.now())}static replaceIfUnsupported(){(!("now"in globalThis.performance)||!("mark"in globalThis.performance)||!("measure"in globalThis.performance)||!("getEntries"in globalThis.performance)||!("getEntriesByType"in globalThis.performance)||!("getEntriesByName"in globalThis.performance)||!("clearMeasures"in globalThis.performance)||!("clearMarks"in globalThis.performance))&&(console.warn("globalThis.performance switch to CompatiblePerformance"),globalThis.performance=new CompatiblePerformance)}clearResourceTimings(){}setResourceTimingBufferSize(e){}addEventListener(e,t,r){}removeEventListener(e,t,r){}dispatchEvent(e){return!0}toJSON(){return{navigation:this.navigation,timeOrigin:this.timeOrigin,timing:this.timing}}now(){return this.now_impl()}mark(e,t){const r={entryType:"mark",name:e,startTime:t?.startTime??this.now(),duration:0,detail:t?.detail,toJSON:()=>null};return this.entries.has("mark")?this.entries.get("mark").push(r):this.entries.set("mark",[r]),r.toJSON=()=>JSON.stringify(r),r}measure(e,t,r){let a,n;t&&(typeof t=="string"?a=t:n=t);let i,s;n&&(typeof n.start=="string"?a=n.start:typeof n.start=="number"&&(i={entryType:"mark",name:a??"",startTime:0,duration:n.start,toJSON:()=>null}),typeof n.end=="string"?r=n.end:typeof n.end=="number"&&(s={entryType:"mark",name:r??"",startTime:this.now(),duration:n.end,toJSON:()=>null})),(!i||!s)&&(!i&&a&&(i=this.getEntriesByName(a,"mark").slice(-1)[0]),!s&&r&&(s=this.getEntriesByName(r,"mark").slice(-1)[0]));const o={entryType:"measure",name:e,startTime:i?.startTime??0,duration:n?.duration??(s?.startTime??0)-(i?.startTime??this.now()),detail:n?.detail??s.detail??i.detail,toJSON:()=>null};return o.toJSON=()=>JSON.stringify(o),this.entries.has("measure")?this.entries.get("measure").push(o):this.entries.set("measure",[o]),o}getEntries(){return[].concat(...this.entries.values())}getEntriesByType(e){return this.entries.get(e)??[]}getEntriesByName(e,t){return t?this.getEntriesByType(t).filter(r=>r.name===e):this.getEntries().filter(r=>r.name===e)}clearMeasures(e){e?this.entries.set("measure",this.getEntriesByType("measure").filter(t=>t.name!==e)):this.entries.delete("measure")}clearMarks(e){e?this.entries.set("mark",this.getEntriesByType("mark").filter(t=>t.name!==e)):this.entries.delete("mark")}}
//# sourceMappingURL=CompatiblePerformance.js.map
