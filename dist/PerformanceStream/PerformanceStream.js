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
*/import{CombinedTransformStream as o}from"../CombinedTransformStream/CombinedTransformStream.js";export class PerformanceStreamBuilder{constructor(r,e,s){this.transforms=[];this.measureName=r,this.startMark=e,this.endMark=s}pipe(r){return this.transforms.push(r),this}build(r){const e=this,s=new TransformStream({start(){performance.clearMeasures(e.measureName),performance.clearMarks(`${e.measureName}.${e.startMark}`),performance.clearMarks(`${e.measureName}.${e.endMark}`)},transform(n,i){performance.mark(`${e.measureName}.${e.startMark}`),i.enqueue(n)}}),u=new TransformStream({transform(n,i){performance.mark(`${e.measureName}.${e.endMark}`),performance.measure(e.measureName,`${e.measureName}.${e.startMark}`,`${e.measureName}.${e.endMark}`),performance.mark(`${e.measureName}.${e.startMark}`),i.enqueue(n)},flush(){e.entries=performance.getEntriesByName(e.measureName),performance.clearMeasures(e.measureName),performance.clearMarks(`${e.measureName}.${e.startMark}`),performance.clearMarks(`${e.measureName}.${e.endMark}`)}}),a=new o(this.transforms,r);return this.transforms.splice(0),s.readable.pipeTo(a.writable,r),a.readable.pipeTo(u.writable,r),{writable:s.writable,readable:u.readable}}result(){if(!this.entries||this.entries.length===0)return;const r=this.entries.map(m=>m.duration);if(r.length===0)return{transforming:0,occupancy:0,minimum:0,maximum:0,average:0,median:0};const e=r.reduce((m,t)=>m+=t,0),s=r.reduce((m,t)=>Math.min(m,t)),u=r.reduce((m,t)=>Math.max(m,t)),a=[...new Set(r.sort((m,t)=>m-t))],n=a.length/2|0,i=a.length===0?0:a.length%2?a[n]:a[n-1]+a[n];return{transforming:r.length,occupancy:e,minimum:s,maximum:u,average:e/r.length,median:i}}}
//# sourceMappingURL=PerformanceStream.js.map
