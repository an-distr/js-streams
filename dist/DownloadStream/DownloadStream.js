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
*/export class DownloadStream extends WritableStream{constructor(l,o){const i=t=>{const a=URL.createObjectURL(t),e=document.createElement("a");e.href=a,e.target="_blank",e.download=l,e.innerText=l,o?.linkHolder?o.linkHolder.appendChild(e):(e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(a),1e4))};if(o?.mode==="filesystem"){let t,a,e;super({async start(){t=await navigator.storage.getDirectory(),a=await t.getFileHandle(l,{create:!0}),e=await a.createWritable()},async write(r){await e.write(r)},async close(){await e.close();const r=await a.getFile();i(r)},async abort(r){e.abort(r),await t.removeEntry(l)}})}else{let t;super({start(){t=[]},write(a){t.push(a)},close(){const a=new Blob(t);i(a)},abort(){t=[]}})}}}
//# sourceMappingURL=DownloadStream.js.map
