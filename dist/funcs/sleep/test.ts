import { sleep } from "./sleep.ts"

const test = async (msec?: number) => {
  console.group(`Wait for ${msec} second(s).`)
  performance.clearMarks("start")
  performance.clearMarks("end")
  performance.clearMeasures("perf")
  performance.mark("start")
  await sleep(msec)
  performance.mark("end")
  performance.measure("perf", "start", "end")
  const perf = performance.getEntriesByName("perf")
  console.log(`elapsed: ${perf[0].duration} msec(s).`)
  console.groupEnd()
}

await test(1000)
await test(1)
await test()

console.log("Test completed.")