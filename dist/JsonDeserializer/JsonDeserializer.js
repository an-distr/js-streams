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
*/import{PullPush as n,PullPushStringQueue as l}from"../PullPush/PullPush.js";export class JsonDeserializer extends n{constructor(i){super(new l),this.lineSeparated=i?.lineSeparated===!0,this.parse=i?.parse??JSON.parse;const a=e=>{let s=!0;for(;s;)switch(e.slice(0,1)){case",":case"[":case" ":case"\r":case`
`:case"	":e=e.slice(1);break;default:s=!1}for(s=!0;s;)switch(e.slice(-1)){case",":case"]":case" ":case"\r":case`
`:case"	":e=e.slice(0,-1);break;default:s=!1}return e};this.sanitize=this.lineSeparated?e=>a(e.split(`\r
`).filter(Boolean).join(`
`).split(`
`).filter(Boolean).join(",")):a,this.indexOfLastSeparator=this.lineSeparated?e=>{for(let s=e.length-1;s>=0;s--)if(e[s]===`
`)return s}:e=>{let s=-1,r=-1;for(let t=e.length-1;t>=0;t--)switch(e[t]){case"{":s=t;break;case",":r=t;break;case"}":if(s>r&&r>t)return r;break}}}async*pullpush(i,a){await this.push(i);do{const e=this.indexOfLastSeparator(this.queue.all());if(e){const s="["+this.sanitize(this.queue.splice(0,e))+"]";await this.push(yield*this.parse(s))}if(a){if(this.queue.more()){const s="["+this.sanitize(this.queue.all())+"]";await this.push(yield*this.parse(s)),this.queue.empty()}}else break}while(this.queue.more())}}
//# sourceMappingURL=JsonDeserializer.js.map