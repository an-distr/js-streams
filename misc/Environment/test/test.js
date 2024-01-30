import { Environment } from "../Environment.js";
(async () => {
    console.table({
        runtime: Environment.runtime(),
        brand: await Environment.brand(),
        version: await Environment.version(),
    });
    console.group("Debug info");
    console.table({
        ua: (typeof window !== "undefined") ? window.navigator.userAgent : "",
        brands: (typeof window !== "undefined" && typeof window.navigator.userAgentData !== "undefined") ? JSON.stringify(window.navigator.userAgentData.brands) : "",
        hasBunApi: Environment.hasBunApi(),
        hasDenoApi: Environment.hasDenoApi(),
        hasNodeApi: Environment.hasNodeApi(),
        hasBrowserApi: Environment.hasBrowserApi(),
    });
    console.groupEnd();
})();
//# sourceMappingURL=test.js.map