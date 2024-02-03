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
*/import{PullPush as a,PullPushArrayQueue as p}from"../PullPush/PullPush.js";export class CsvLineEncoder extends a{constructor(i){super(new p);this.keys=new Map;this.delimiter=i?.delimiter??",",this.escape=i?.escape??"auto",this.withNewLine=i?.withNewLine??!0,this.newLine=this.withNewLine?i?.newLine??`
`:"",this.doEscape=typeof this.escape!="string"?this.escape:this.escape==="auto"?e=>e.includes('"')||e.includes(`
`)?'"'+e.replace(/\"/g,'""')+'"':e:this.escape==="all"?e=>'"'+e.replace(/\"/g,'""')+'"':e=>e}async*pullpush(i){for(await this.push(i);this.queue.more();){const e=this.queue.pop(),t=Object.keys(e).join(",");if(!this.keys.has(t)){const s=[];for(const r in e)s.push(r);this.keys.set(t,s)}const n=this.keys.get(t).map(s=>e[s]).map(s=>s?.toString()??"").map(this.doEscape).join(this.delimiter);await this.push(yield n+this.newLine)}}}
//# sourceMappingURL=CsvLineEncoder.js.map