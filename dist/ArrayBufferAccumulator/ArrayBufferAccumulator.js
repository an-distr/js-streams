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
*/import{PullPush as n,PullPushNonQueue as c}from"../PullPush/PullPush.js";export class ArrayBufferAccumulator extends n{constructor(t,s){super(new c),this.size=t,this.fixed=s?.forceEmit?!1:s?.fixed??!1,this.buffer=new ArrayBuffer(t),this.bufferView=new Uint8Array(this.buffer),this.pos=0,s?.forceEmit&&(Array.isArray(s.forceEmit)?this.forceEmit=i=>{const f=[];for(const r of i)f.push(r);const u=s.forceEmit;for(let r=0;r<u.length;++r){const e=u[r];let o=0,h=0;for(const l of f.values()){if(l!==e[h]){++o,h=0;continue}if(e.length===h+1)return o+e.length;++o,++h}}return-1}:this.forceEmit=s.forceEmit)}async*pullpush(t,s){if(t){let i,f;if(Array.isArray(t))i=new Uint8Array(t),f=t.length;else{const e=t;i=new Uint8Array(e),f=e.byteLength}let u=0,r;for(;f>0;)if(this.pos===this.size&&(yield this.bufferView.slice(),this.pos=0),r=Math.min(this.size-this.pos,f),this.bufferView.set(i.slice(u,u+r),this.pos),this.pos+=r,u+=r,f-=r,this.forceEmit&&this.pos>0){let e=this.forceEmit(this.bufferView.slice(0,this.pos).values());for(;e>0;)yield this.bufferView.slice(0,e),this.bufferView.copyWithin(0,e,this.size),this.pos-=e,e=this.forceEmit(this.bufferView.slice(0,this.pos).values())}}if(s&&this.pos>0){if(this.forceEmit){let i=this.forceEmit(this.bufferView.slice(0,this.pos).values());for(;i>0;)yield this.bufferView.slice(0,i),this.bufferView.copyWithin(0,i,this.size),this.pos-=i,i=this.forceEmit(this.bufferView.slice(0,this.pos).values())}this.fixed&&(this.bufferView.fill(0,this.pos),this.pos=this.size),this.pos>0&&(yield this.bufferView.slice(0,this.pos))}}}
//# sourceMappingURL=ArrayBufferAccumulator.js.map
