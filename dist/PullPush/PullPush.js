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
*/export class PullPushNonQueue{length(){return 0}more(){return!0}all(){throw new Error("Method not implemented.")}push(e){}pop(){}empty(){}splice(e,u){throw new Error("Method not implemented.")}}export class PullPushArrayQueue{constructor(){this.queue=[]}length(){return this.queue.length}more(){return this.queue.length>0}all(){return this.queue}push(e){this.queue.push(e)}pop(){return this.queue.pop()}empty(){this.queue.splice(0)}splice(e,u){return u?this.queue.splice(e,u):this.queue.splice(e)}}export class PullPushStringQueue{constructor(){this.queue=""}length(){return this.queue.length}more(){return this.queue.length>0}all(){return this.queue}push(e){this.queue+=e}pop(){return this.splice(-1)}empty(){this.queue=""}splice(e,u){if(u){const s=this.queue.slice(e,e+u);return this.queue=this.queue.slice(0,e)+this.queue.slice(e+u),s}else{const s=this.queue.slice(e);return this.queue=this.queue.slice(0,e),s}}}export class PullPush{constructor(e){this.queue=e}async push(e){if(e!==void 0)if(typeof e=="function"&&(e=await e()),e===null)this.queue.push(e);else if(typeof e=="string")this.queue.push(e);else if(Array.isArray(e))for(const u of e)this.queue.push(u);else if(typeof e[Symbol.iterator]=="function")for(const u of e)this.queue.push(u);else if(typeof e[Symbol.asyncIterator]=="function")for await(const u of e)this.queue.push(u);else this.queue.push(e)}pull(e){return this.pullpush(e)}flush(e){return this.pullpush(e,!0)}[Symbol.asyncIterator](){return this.flush()}readable(e){const u=this;return new ReadableStream({async start(s){for await(const r of u.flush(e))s.enqueue(r);s.close()}})}transform(){const e=this;return new TransformStream({async transform(u,s){for await(const r of e.pull(u))s.enqueue(r)},async flush(u){for await(const s of e.flush())u.enqueue(s)}})}writable(){const e=this;return new WritableStream({async write(u){await e.push(u)}})}}
//# sourceMappingURL=PullPush.js.map