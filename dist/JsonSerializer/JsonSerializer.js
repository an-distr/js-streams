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
*/import{PullPush as e,PullPushArrayQueue as a}from"../PullPush/PullPush.js";export class JsonSerializer extends e{constructor(i){super(new a),this.lineSeparated=i?.lineSeparated===!0,this.separator=this.lineSeparated?`
`:",",this.stringify=i?.stringify??JSON.stringify,this.isNotFirst=!1}async*pullpush(i,t){await this.push(i);do{for(const s of this.queue.splice(0))this.isNotFirst?await this.push(yield this.separator+this.stringify(s)):(this.lineSeparated||await this.push(yield"["),await this.push(yield this.stringify(s)),this.isNotFirst=!0);t&&(this.lineSeparated||await this.push(yield"]"),this.isNotFirst=!1)}while(this.queue.more())}}
//# sourceMappingURL=JsonSerializer.js.map