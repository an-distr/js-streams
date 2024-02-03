import { Environment } from "../Environment.ts"

(async () => {

  console.table({
    runtime: Environment.runtime(),
    brand: await Environment.brand(),
    version: await Environment.version(),
  })

  console.group("Debug info")
  console.table({
    ua: (typeof window !== "undefined") ? window.navigator.userAgent : "",
    brands: (typeof window !== "undefined" && typeof (window.navigator as any).userAgentData !== "undefined") ? JSON.stringify((window.navigator as any).userAgentData.brands) : "",
    hasBunApi: Environment.hasBunApi(),
    hasDenoApi: Environment.hasDenoApi(),
    hasNodeApi: Environment.hasNodeApi(),
    hasBrowserApi: Environment.hasBrowserApi(),
  })
  console.groupEnd()

})()