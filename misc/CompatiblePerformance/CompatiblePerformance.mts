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
  clearResourceTimings(): void { }
  /*! Not implemented */
  setResourceTimingBufferSize(maxSize: number): void { }
  /*! Not implemented */
  addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined): void { }
  /*! Not implemented */
  removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | EventListenerOptions | undefined): void { }
  /*! Not implemented */
  dispatchEvent(event: Event): boolean { return true }
  /*! Not implemented */
  toJSON(): any { return { navigation: this.navigation, timeOrigin: this.timeOrigin, timing: this.timing, } }

  entries: Map<string, PerformanceEntryList> = new Map<string, PerformanceEntryList>

  now(): number {
    return Date.now()
  }

  mark(markName: string, markOptions?: PerformanceMarkOptions | undefined): PerformanceMark {
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

  measure(measureName: string, startOrMeasureOptions?: string | PerformanceMeasureOptions | undefined, endMark?: string | undefined): PerformanceMeasure {
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
      const marks = this.getEntriesByType("mark")
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

  getEntries(): PerformanceEntryList {
    return ([] as PerformanceEntryList).concat(...this.entries.values())
  }

  getEntriesByType(type: string): PerformanceEntryList {
    return this.entries.get(type) ?? [] as PerformanceEntryList
  }

  getEntriesByName(name: string, type?: string | undefined): PerformanceEntryList {
    if (type) {
      return this.getEntriesByType(type).filter(e => e.name === name)
    }
    else {
      return this.getEntries().filter(e => e.name === name)
    }
  }

  clearMeasures(measureName?: string | undefined): void {
    if (measureName) {
      this.entries.set("measure", this.getEntriesByType("measure").filter(e => e.name !== measureName))
    }
    else {
      this.entries.delete("measure")
    }
  }

  clearMarks(markName?: string | undefined): void {
    if (markName) {
      this.entries.set("mark", this.getEntriesByType("mark").filter(e => e.name !== markName))
    }
    else {
      this.entries.delete("mark")
    }
  }
}