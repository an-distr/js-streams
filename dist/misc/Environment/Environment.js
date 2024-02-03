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
*/export class Environment{static getUserAgentData(){if("userAgentData"in window.navigator)return window.navigator.userAgentData}static async getHighEntropyValues(e){const r=this.getUserAgentData();if(r&&"getHighEntropyValues"in r)try{return await r.getHighEntropyValues(e)}catch{}}static hasBunApi(){return typeof Bun<"u"}static hasDenoApi(){return typeof Deno<"u"}static hasNodeApi(){return typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u"}static hasBrowserApi(){return typeof window<"u"}static async getBrands(){let e;if(this.hasBunApi())e=[{brand:"Bun",version:Bun.version}];else if(this.hasDenoApi())e=[{brand:"Deno",version:Deno.version.deno}];else if(this.hasNodeApi())e=[{brand:"Node",version:process.versions.node}];else{const r=await this.getHighEntropyValues(["fullVersionList"]);if(r?.fullVersionList)e=r.fullVersionList.filter(i=>!i.brand.includes("Not")),e.length>=2&&(e=e.filter(i=>i.brand!=="Chromium"));else{const i=this.getUserAgentData();i&&i.brands&&(e=i.brands.filter(s=>!s.brand.includes("Not")))}e?.length===0&&(e=void 0)}return e??this.getBrandsFromUA()}static getBrandsFromUA(){let e=(window.navigator.userAgent??"").split(" ").filter(n=>n.includes("/")).filter(n=>!n.includes("Mozilla")).filter(n=>!n.includes("Gecko")).filter(n=>!n.includes("WebKit")).filter(n=>!n.includes("Mobile"));const r=e.findIndex(n=>n.includes("Version"));r>=0&&(e=e.filter(n=>!n.includes("Safari")),e[r]=e[r].replace("Version","Safari"));const i=e.findIndex(n=>n.includes("CriOS"));i>=0&&(e[i]=e[i].replace("CriOS","Chrome"));const s=e.findIndex(n=>n.includes("EdgiOS"));s>=0&&(e[s]=e[s].replace("EdgiOS","Edg"));const t=e.findIndex(n=>n.includes("FxiOS"));return t>=0&&(e[t]=e[t].replace("FxiOS","FireFox")),e.some(n=>n.includes("Edg")||n.includes("OPT")||n.includes("OPR")||n.includes("DuckDuckGo"))&&(e=e.filter(n=>!n.includes("Chrome")).filter(n=>!n.includes("Safari"))),e.some(n=>n.includes("Chrome"))&&(e=e.filter(n=>!n.includes("Safari"))),e.map(n=>({brand:n.split("/")[0],version:n.split("/")[1]}))}static runtime(){return this.hasBunApi()||this.hasDenoApi()||this.hasNodeApi()?"Server":this.hasBrowserApi()?"Browser":"Unknown"}static async brand(){const e=await this.getBrands();return e.length>0?e[0].brand:"Unknown"}static async version(){const e=await this.getBrands();return e.length>0?e[0].version:"Unknown"}}
//# sourceMappingURL=Environment.js.map