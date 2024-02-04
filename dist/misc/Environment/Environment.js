"use strict";
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
    return void 0;
  }
  static async getHighEntropyValues(hints) {
    const uad = this.getUserAgentData();
    if (uad && "getHighEntropyValues" in uad) {
      try {
        return await uad.getHighEntropyValues(hints);
      } catch {
      }
    }
    return void 0;
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
        // @ts-ignore
        version: Bun.version
      }];
    } else if (this.hasDenoApi()) {
      brands = [{
        brand: "Deno",
        // @ts-ignore
        version: Deno.version.deno
      }];
    } else if (this.hasNodeApi()) {
      brands = [{
        brand: "Node",
        // @ts-ignore
        version: process.versions.node
      }];
    } else {
      const hevs = await this.getHighEntropyValues(["fullVersionList"]);
      if (hevs?.fullVersionList) {
        brands = hevs.fullVersionList.filter((x) => !x.brand.includes("Not"));
        if (brands.length >= 2) {
          brands = brands.filter((x) => x.brand !== "Chromium");
        }
      } else {
        const uad = this.getUserAgentData();
        if (uad && uad.brands) {
          brands = uad.brands.filter((x) => !x.brand.includes("Not"));
        }
      }
      if (brands?.length === 0) {
        brands = void 0;
      }
    }
    return brands ?? this.getBrandsFromUA();
  }
  static getBrandsFromUA() {
    let pairs = (window.navigator.userAgent ?? "").split(" ").filter((x) => x.includes("/")).filter((x) => !x.includes("Mozilla")).filter((x) => !x.includes("Gecko")).filter((x) => !x.includes("WebKit")).filter((x) => !x.includes("Mobile"));
    const versionIndex = pairs.findIndex((x) => x.includes("Version"));
    if (versionIndex >= 0) {
      pairs = pairs.filter((x) => !x.includes("Safari"));
      pairs[versionIndex] = pairs[versionIndex].replace("Version", "Safari");
    }
    const criOSIndex = pairs.findIndex((x) => x.includes("CriOS"));
    if (criOSIndex >= 0) {
      pairs[criOSIndex] = pairs[criOSIndex].replace("CriOS", "Chrome");
    }
    const edgiOSIndex = pairs.findIndex((x) => x.includes("EdgiOS"));
    if (edgiOSIndex >= 0) {
      pairs[edgiOSIndex] = pairs[edgiOSIndex].replace("EdgiOS", "Edg");
    }
    const fxiOSIndex = pairs.findIndex((x) => x.includes("FxiOS"));
    if (fxiOSIndex >= 0) {
      pairs[fxiOSIndex] = pairs[fxiOSIndex].replace("FxiOS", "FireFox");
    }
    if (pairs.some((x) => x.includes("Edg") || x.includes("OPT") || x.includes("OPR") || x.includes("DuckDuckGo"))) {
      pairs = pairs.filter((x) => !x.includes("Chrome")).filter((x) => !x.includes("Safari"));
    }
    if (pairs.some((x) => x.includes("Chrome"))) {
      pairs = pairs.filter((x) => !x.includes("Safari"));
    }
    return pairs.map((x) => {
      const brand = {
        brand: x.split("/")[0],
        version: x.split("/")[1]
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
