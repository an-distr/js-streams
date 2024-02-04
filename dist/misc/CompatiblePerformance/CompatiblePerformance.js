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
export class CompatiblePerformance {
  constructor() {
    /*! Not implemented */
    this.navigation = {};
    /*! Not implemented */
    this.timeOrigin = 0;
    /*! Not implemented */
    this.timing = {};
    /*! Not implemented */
    this.eventCounts = {};
    /*! Not implemented */
    this.onresourcetimingbufferfull = () => null;
    this.entries = /* @__PURE__ */ new Map();
    this.now_impl = globalThis.performance.now ?? (() => Date.now());
  }
  static replaceIfUnsupported() {
    if (!("now" in globalThis.performance) || !("mark" in globalThis.performance) || !("measure" in globalThis.performance) || !("getEntries" in globalThis.performance) || !("getEntriesByType" in globalThis.performance) || !("getEntriesByName" in globalThis.performance) || !("clearMeasures" in globalThis.performance) || !("clearMarks" in globalThis.performance)) {
      console.warn("globalThis.performance switch to CompatiblePerformance");
      globalThis.performance = new CompatiblePerformance();
    }
  }
  /*! Not implemented */
  clearResourceTimings() {
  }
  /*! Not implemented */
  setResourceTimingBufferSize(_maxSize) {
  }
  /*! Not implemented */
  addEventListener(_type, _callback, _options) {
  }
  /*! Not implemented */
  removeEventListener(_type, _callback, _options) {
  }
  /*! Not implemented */
  dispatchEvent(_event) {
    return true;
  }
  /*! Not implemented */
  toJSON() {
    return { navigation: this.navigation, timeOrigin: this.timeOrigin, timing: this.timing };
  }
  now() {
    return this.now_impl();
  }
  mark(markName, markOptions) {
    const entry = {
      entryType: "mark",
      name: markName,
      startTime: markOptions?.startTime ?? this.now(),
      duration: 0,
      detail: markOptions?.detail,
      toJSON: () => null
    };
    if (this.entries.has("mark")) {
      this.entries.get("mark").push(entry);
    } else {
      this.entries.set("mark", [entry]);
    }
    entry.toJSON = () => JSON.stringify(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let startMark;
    let options;
    if (startOrMeasureOptions) {
      if (typeof startOrMeasureOptions === "string") {
        startMark = startOrMeasureOptions;
      } else {
        options = startOrMeasureOptions;
      }
    }
    let lastStartMark;
    let lastEndMark;
    if (options) {
      if (typeof options.start === "string") {
        startMark = options.start;
      } else if (typeof options.start === "number") {
        lastStartMark = {
          entryType: "mark",
          name: startMark ?? "",
          startTime: 0,
          duration: options.start,
          toJSON: () => null
        };
      }
      if (typeof options.end === "string") {
        endMark = options.end;
      } else if (typeof options.end === "number") {
        lastEndMark = {
          entryType: "mark",
          name: endMark ?? "",
          startTime: this.now(),
          duration: options.end,
          toJSON: () => null
        };
      }
    }
    if (!lastStartMark || !lastEndMark) {
      if (!lastStartMark && startMark) {
        lastStartMark = this.getEntriesByName(startMark, "mark").slice(-1)[0];
      }
      if (!lastEndMark && endMark) {
        lastEndMark = this.getEntriesByName(endMark, "mark").slice(-1)[0];
      }
    }
    const entry = {
      entryType: "measure",
      name: measureName,
      startTime: lastStartMark?.startTime ?? 0,
      duration: options?.duration ?? (lastEndMark?.startTime ?? 0) - (lastStartMark?.startTime ?? this.now()),
      detail: options?.detail ?? lastEndMark.detail ?? lastStartMark.detail,
      toJSON: () => null
    };
    entry.toJSON = () => JSON.stringify(entry);
    if (this.entries.has("measure")) {
      this.entries.get("measure").push(entry);
    } else {
      this.entries.set("measure", [entry]);
    }
    return entry;
  }
  getEntries() {
    return [].concat(...this.entries.values());
  }
  getEntriesByType(type) {
    return this.entries.get(type) ?? [];
  }
  getEntriesByName(name, type) {
    if (type) {
      return this.getEntriesByType(type).filter((e) => e.name === name);
    } else {
      return this.getEntries().filter((e) => e.name === name);
    }
  }
  clearMeasures(measureName) {
    if (measureName) {
      this.entries.set("measure", this.getEntriesByType("measure").filter((e) => e.name !== measureName));
    } else {
      this.entries.delete("measure");
    }
  }
  clearMarks(markName) {
    if (markName) {
      this.entries.set("mark", this.getEntriesByType("mark").filter((e) => e.name !== markName));
    } else {
      this.entries.delete("mark");
    }
  }
}
//# sourceMappingURL=CompatiblePerformance.js.map
