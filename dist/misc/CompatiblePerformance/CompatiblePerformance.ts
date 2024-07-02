/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-distr)

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
  private entries: Map<string, PerformanceEntryList>
  private now_impl: () => number

  constructor() {
    this.entries = new Map<string, PerformanceEntryList>
    this.now_impl = globalThis.performance.now ?? (() => Date.now())
  }

  static replaceIfUnsupported() {
    if (
      !("now" in globalThis.performance) ||
      !("mark" in globalThis.performance) ||
      !("measure" in globalThis.performance) ||
      !("getEntries" in globalThis.performance) ||
      !("getEntriesByType" in globalThis.performance) ||
      !("getEntriesByName" in globalThis.performance) ||
      !("clearMeasures" in globalThis.performance) ||
      !("clearMarks" in globalThis.performance)
    ) {
      console.warn("globalThis.performance switch to CompatiblePerformance")
      globalThis.performance = new CompatiblePerformance
    }
  }

  /*! Not implemented */
  navigation: PerformanceNavigation = {} as PerformanceNavigation
  /*! Not implemented */
  timeOrigin: number = 0
  /*! Not implemented */
  timing: PerformanceTiming = {} as PerformanceTiming
  /*! Not implemented */
  eventCounts: EventCounts = {} as EventCounts
  /*! Not implemented */
  onresourcetimingbufferfull: ((this: Performance, ev: Event) => any) | null = () => null
  /*! Not implemented */
  clearResourceTimings() { }
  /*! Not implemented */
  setResourceTimingBufferSize(_maxSize: number) { }
  /*! Not implemented */
  addEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | AddEventListenerOptions) { }
  /*! Not implemented */
  removeEventListener(_type: string, _callback: EventListenerOrEventListenerObject | null, _options?: boolean | EventListenerOptions) { }
  /*! Not implemented */
  dispatchEvent(_event: Event) { return true }
  /*! Not implemented */
  toJSON() { return { navigation: this.navigation, timeOrigin: this.timeOrigin, timing: this.timing, } }

  now() {
    return this.now_impl()
  }

  mark(markName: string, markOptions?: PerformanceMarkOptions) {
    const entry: PerformanceMark = {
      entryType: "mark",
      name: markName,
      startTime: markOptions?.startTime ?? this.now(),
      duration: 0,
      detail: markOptions?.detail,
      toJSON: () => null,
    }
    if (this.entries.has("mark")) {
      this.entries.get("mark")!.push(entry)
    }
    else {
      this.entries.set("mark", [entry])
    }
    entry.toJSON = () => JSON.stringify(entry)
    return entry
  }

  measure(measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions, endMark?: string) {
    let startMark: string | undefined
    let options: PerformanceMeasureOptions | undefined
    if (startOrMeasureOptions) {
      if (typeof startOrMeasureOptions === "string") {
        startMark = startOrMeasureOptions
      }
      else {
        options = startOrMeasureOptions
      }
    }

    let lastStartMark: PerformanceEntry | undefined
    let lastEndMark: PerformanceEntry | undefined
    if (options) {
      if (typeof options.start === "string") {
        startMark = options.start
      }
      else if (typeof options.start === "number") {
        lastStartMark = {
          entryType: "mark",
          name: startMark ?? "",
          startTime: 0,
          duration: options.start,
          toJSON: () => null,
        }
      }
      if (typeof options.end === "string") {
        endMark = options.end
      }
      else if (typeof options.end === "number") {
        lastEndMark = {
          entryType: "mark",
          name: endMark ?? "",
          startTime: this.now(),
          duration: options.end,
          toJSON: () => null,
        }
      }
    }
    if (!lastStartMark || !lastEndMark) {
      if (!lastStartMark && startMark) {
        lastStartMark = this.getEntriesByName(startMark, "mark").slice(-1)[0]
      }
      if (!lastEndMark && endMark) {
        lastEndMark = this.getEntriesByName(endMark, "mark").slice(-1)[0]
      }
    }

    const entry: PerformanceMeasure = {
      entryType: "measure",
      name: measureName,
      startTime: lastStartMark?.startTime ?? 0,
      duration: options?.duration ?? (lastEndMark?.startTime ?? 0) - (lastStartMark?.startTime ?? this.now()),
      detail: options?.detail ?? (lastEndMark as PerformanceMark).detail ?? (lastStartMark as PerformanceMark).detail,
      toJSON: () => null,
    }
    entry.toJSON = () => JSON.stringify(entry)
    if (this.entries.has("measure")) {
      this.entries.get("measure")!.push(entry)
    }
    else {
      this.entries.set("measure", [entry])
    }
    return entry
  }

  getEntries() {
    return ([] as PerformanceEntryList).concat(...this.entries.values())
  }

  getEntriesByType(type: string) {
    return this.entries.get(type) ?? [] as PerformanceEntryList
  }

  getEntriesByName(name: string, type?: string) {
    if (type) {
      return this.getEntriesByType(type).filter(e => e.name === name)
    }
    else {
      return this.getEntries().filter(e => e.name === name)
    }
  }

  clearMeasures(measureName?: string) {
    if (measureName) {
      this.entries.set("measure", this.getEntriesByType("measure").filter(e => e.name !== measureName))
    }
    else {
      this.entries.delete("measure")
    }
  }

  clearMarks(markName?: string) {
    if (markName) {
      this.entries.set("mark", this.getEntriesByType("mark").filter(e => e.name !== markName))
    }
    else {
      this.entries.delete("mark")
    }
  }
}