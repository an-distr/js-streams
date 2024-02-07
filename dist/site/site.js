const console = document.getElementById("console");
if (console) {
  import("/misc/DomConsole/DomConsole.min.js").then((mod) => {
    const { DomConsole } = mod;
    globalThis.console = new DomConsole(console, globalThis.console);
    const dcStyle = document.createElement("link");
    dcStyle.rel = "stylesheet";
    dcStyle.href = "/misc/DomConsole/DomConsole.min.css";
    document.head.appendChild(dcStyle);
    const siteTheme2 = document.getElementById("siteTheme");
    siteTheme2.addEventListener("change", () => {
      const dcTheme = document.getElementById("dc-theme") ?? (() => {
        const dcTheme2 = document.createElement("link");
        dcTheme2.rel = "stylesheet";
        document.head.appendChild(dcTheme2);
        return dcTheme2;
      })();
      if (dcTheme) {
        switch (siteTheme2.value) {
          case "light":
            dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.light.min.css";
            break;
          case "dark":
            dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.dark.min.css";
            break;
          default:
            dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.min.css";
        }
      }
    });
    siteTheme2.dispatchEvent(new Event("change"));
  });
} else {
  siteTheme.dispatchEvent(new Event("change"));
}
if (location.host.startsWith("localhost") || location.host.startsWith("127.0.0.1")) {
  document.title += " (local)";
} else if (location.host.split(".").length > 3) {
  document.title += ` (${location.host.split(".")[0]})`;
}
const h1 = document.getElementsByTagName("h1")[0];
if (h1.textContent.length === 0) {
  h1.textContent = document.title;
}
const toTop = document.createElement("a");
toTop.style.position = "fixed";
toTop.style.bottom = "0";
toTop.style.right = "0";
toTop.style.marginBottom = "1rem";
toTop.style.marginRight = "1rem";
toTop.style.cursor = "pointer";
toTop.href = "#";
toTop.textContent = "Top";
toTop.onclick = (e) => {
  e.preventDefault();
  window.scroll({ top: 0 });
};
document.body.append(toTop);
//# sourceMappingURL=site.js.map
