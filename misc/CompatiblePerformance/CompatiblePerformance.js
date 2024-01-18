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
        var _a;
        this.navigation = {};
        this.timeOrigin = 0;
        this.timing = {};
        this.eventCounts = {};
        this.onresourcetimingbufferfull = () => null;
        this.entries = new Map;
        this.now_impl = (_a = globalThis.performance.now) !== null && _a !== void 0 ? _a : (() => Date.now());
    }
    static replaceIfUnsupported() {
        if (!("now" in globalThis.performance) ||
            !("mark" in globalThis.performance) ||
            !("measure" in globalThis.performance) ||
            !("getEntries" in globalThis.performance) ||
            !("getEntriesByType" in globalThis.performance) ||
            !("getEntriesByName" in globalThis.performance) ||
            !("clearMeasures" in globalThis.performance) ||
            !("clearMarks" in globalThis.performance)) {
            console.warn("globalThis.performance switch to CompatiblePerformance");
            globalThis.performance = new CompatiblePerformance;
        }
    }
    clearResourceTimings() { }
    setResourceTimingBufferSize(_maxSize) { }
    addEventListener(_type, _callback, _options) { }
    removeEventListener(_type, _callback, _options) { }
    dispatchEvent(_event) { return true; }
    toJSON() { return { navigation: this.navigation, timeOrigin: this.timeOrigin, timing: this.timing, }; }
    now() {
        return this.now_impl();
    }
    mark(markName, markOptions) {
        var _a;
        const entry = {
            entryType: "mark",
            name: markName,
            startTime: (_a = markOptions === null || markOptions === void 0 ? void 0 : markOptions.startTime) !== null && _a !== void 0 ? _a : this.now(),
            duration: 0,
            detail: markOptions === null || markOptions === void 0 ? void 0 : markOptions.detail,
            toJSON: () => null,
        };
        if (this.entries.has("mark")) {
            this.entries.get("mark").push(entry);
        }
        else {
            this.entries.set("mark", [entry]);
        }
        entry.toJSON = () => JSON.stringify(entry);
        return entry;
    }
    measure(measureName, startOrMeasureOptions, endMark) {
        var _a, _b, _c, _d, _e, _f;
        let startMark;
        let options;
        if (startOrMeasureOptions) {
            if (typeof startOrMeasureOptions === "string") {
                startMark = startOrMeasureOptions;
            }
            else {
                options = startOrMeasureOptions;
            }
        }
        let lastStartMark;
        let lastEndMark;
        if (options) {
            if (typeof options.start === "string") {
                startMark = options.start;
            }
            else if (typeof options.start === "number") {
                lastStartMark = {
                    entryType: "mark",
                    name: startMark !== null && startMark !== void 0 ? startMark : "",
                    startTime: 0,
                    duration: options.start,
                    toJSON: () => null,
                };
            }
            if (typeof options.end === "string") {
                endMark = options.end;
            }
            else if (typeof options.end === "number") {
                lastEndMark = {
                    entryType: "mark",
                    name: endMark !== null && endMark !== void 0 ? endMark : "",
                    startTime: this.now(),
                    duration: options.end,
                    toJSON: () => null,
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
            startTime: (_a = lastStartMark === null || lastStartMark === void 0 ? void 0 : lastStartMark.startTime) !== null && _a !== void 0 ? _a : 0,
            duration: (_b = options === null || options === void 0 ? void 0 : options.duration) !== null && _b !== void 0 ? _b : ((_c = lastEndMark === null || lastEndMark === void 0 ? void 0 : lastEndMark.startTime) !== null && _c !== void 0 ? _c : 0) - ((_d = lastStartMark === null || lastStartMark === void 0 ? void 0 : lastStartMark.startTime) !== null && _d !== void 0 ? _d : this.now()),
            detail: (_f = (_e = options === null || options === void 0 ? void 0 : options.detail) !== null && _e !== void 0 ? _e : lastEndMark.detail) !== null && _f !== void 0 ? _f : lastStartMark.detail,
            toJSON: () => null,
        };
        entry.toJSON = () => JSON.stringify(entry);
        if (this.entries.has("measure")) {
            this.entries.get("measure").push(entry);
        }
        else {
            this.entries.set("measure", [entry]);
        }
        return entry;
    }
    getEntries() {
        return [].concat(...this.entries.values());
    }
    getEntriesByType(type) {
        var _a;
        return (_a = this.entries.get(type)) !== null && _a !== void 0 ? _a : [];
    }
    getEntriesByName(name, type) {
        if (type) {
            return this.getEntriesByType(type).filter(e => e.name === name);
        }
        else {
            return this.getEntries().filter(e => e.name === name);
        }
    }
    clearMeasures(measureName) {
        if (measureName) {
            this.entries.set("measure", this.getEntriesByType("measure").filter(e => e.name !== measureName));
        }
        else {
            this.entries.delete("measure");
        }
    }
    clearMarks(markName) {
        if (markName) {
            this.entries.set("mark", this.getEntriesByType("mark").filter(e => e.name !== markName));
        }
        else {
            this.entries.delete("mark");
        }
    }
}
//# sourceMappingURL=CompatiblePerformance.js.map