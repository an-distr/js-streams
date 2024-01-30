/*!
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
*/
export class Environment {
    static getUserAgentData() {
        if ("userAgentData" in window.navigator) {
            return window.navigator.userAgentData;
        }
        return undefined;
    }
    static async getHighEntropyValues(hints) {
        const uad = this.getUserAgentData();
        if (uad && "getHighEntropyValues" in uad) {
            try {
                return await uad.getHighEntropyValues(hints);
            }
            catch (_a) { }
        }
        return undefined;
    }
    static hasBunApi() {
        return typeof Bun !== "undefined";
    }
    static hasDenoApi() {
        return typeof Deno !== "undefined";
    }
    static hasNodeApi() {
        return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
    }
    static hasBrowserApi() {
        return typeof window !== "undefined";
    }
    static async getBrands() {
        let brands;
        if (this.hasBunApi()) {
            brands = [{
                    brand: "Bun",
                    version: Bun.version,
                }];
        }
        else if (this.hasDenoApi()) {
            brands = [{
                    brand: "Deno",
                    version: Deno.version.deno,
                }];
        }
        else if (this.hasNodeApi()) {
            brands = [{
                    brand: "Node",
                    version: process.versions.node,
                }];
        }
        else {
            const hevs = await this.getHighEntropyValues(["fullVersionList"]);
            if (hevs === null || hevs === void 0 ? void 0 : hevs.fullVersionList) {
                brands = hevs.fullVersionList
                    .filter(x => !x.brand.startsWith("Not"));
                if (brands.length >= 2) {
                    brands = brands.filter(x => x.brand !== "Chromium");
                }
            }
            else {
                const uad = this.getUserAgentData();
                if (uad && uad.brands) {
                    brands = uad.brands
                        .filter(x => !x.brand.startsWith("Not"));
                }
            }
        }
        return brands !== null && brands !== void 0 ? brands : this.getBrandsFromUA();
    }
    static getBrandsFromUA() {
        var _a;
        let pairs = ((_a = window.navigator.userAgent) !== null && _a !== void 0 ? _a : "")
            .split(" ")
            .filter(x => x.includes("/"))
            .filter(x => !x.includes("Mozilla"))
            .filter(x => !x.includes("Mobile"));
        if (pairs.length >= 2) {
            pairs = pairs
                .filter(x => !x.includes("Gecko"))
                .filter(x => !x.includes("WebKit"));
        }
        const versionIndex = pairs.findIndex(x => x.includes("Version"));
        if (versionIndex >= 0) {
            pairs = pairs
                .filter(x => !x.includes("Safari"));
            pairs[versionIndex] = pairs[versionIndex].replace("Version", "Safari");
        }
        const criOsIndex = pairs.findIndex(x => x.includes("CriOS"));
        if (criOsIndex >= 0) {
            pairs[versionIndex] = pairs[versionIndex].replace("CriOS", "Chrome");
        }
        if (pairs.some(x => x.includes("Edg"))) {
            pairs = pairs
                .filter(x => !x.includes("Chrome"))
                .filter(x => !x.includes("Safari"));
        }
        if (pairs.some(x => x.includes("Chrome"))) {
            pairs = pairs
                .filter(x => !x.includes("Safari"));
        }
        return pairs.map(x => {
            const brand = {
                brand: x.split("/")[0],
                version: x.split("/")[1],
            };
            return brand;
        });
    }
    static runtime() {
        if (this.hasBunApi() || this.hasDenoApi() || this.hasNodeApi())
            return "Server";
        else if (this.hasBrowserApi())
            return "Browser";
        return "Unknown";
    }
    static async brand() {
        const brands = await this.getBrands();
        if (brands.length > 0)
            return brands[0].brand;
        return "Unknown";
    }
    static async version() {
        const brands = await this.getBrands();
        if (brands.length > 0)
            return brands[0].version;
        return "Unknown";
    }
}
//# sourceMappingURL=Environment.js.map