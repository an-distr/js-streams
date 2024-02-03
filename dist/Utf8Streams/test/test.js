"use strict";import{Utf8DecoderStream as r,Utf8EncoderStream as s}from"../Utf8Streams.js";const c=o=>new ReadableStream({start(e){e.enqueue(o),e.close()}}),n=o=>new TransformStream({transform(e,a){console.log(o,e),a.enqueue(e)}}),i=o=>new WritableStream({write(e){o.s=e}}),l=()=>{console.group("Builtin"),console.log("TextEncoderStream","TextEncoderStream"in globalThis),console.log("TextEncoderStream","TextDecoderStream"in globalThis),console.groupEnd()},g=()=>{console.group("Properties");const o=new s;console.log("Utf8EncoderStream",{encoding:o.encoding});const e=new r;console.log("Utf8DecoderStream",{encoding:e.encoding,fatal:e.fatal,ignoreBOM:e.ignoreBOM}),console.groupEnd()},t=async o=>{console.group("value:",o,"type:",typeof o);const e={s:null};await c(o).pipeThrough(n("Before Utf8EncoderStream")).pipeThrough(new s).pipeThrough(n("After Utf8EncoderStream")).pipeThrough(new r).pipeThrough(n("After Utf8DecoderStream")).pipeTo(i(e)),console.assert(o===e.s||o===void 0&&e.s==="","Not matched.",e.s),console.log("Result:",e.s,"type:",typeof e.s),console.groupEnd()};l(),g(),await t(void 0),await t(""),await t("a"),await t(`	a
b`),await t("a".repeat(1024));
//# sourceMappingURL=test.js.map
