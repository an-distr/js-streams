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
        hasBunApi: Environment.hasBunApi(),
        hasDenoApi: Environment.hasDenoApi(),
        hasNodeApi: Environment.hasNodeApi(),
        hasBrowserApi: Environment.hasBrowserApi(),
    });
    console.groupEnd();
})();
//# sourceMappingURL=test.js.map