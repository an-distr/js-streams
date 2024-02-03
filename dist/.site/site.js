if (location.host.split(".").length > 3) {
  document.title += ` (${location.host.split(".")[0]})`
}
else if (location.host.startsWith("localhost")) {
  document.title += " (local)"
}
const h1 = document.getElementsByTagName("h1")[0]
if (h1.textContent.length === 0) {
  h1.textContent = document.title
}

const siteTheme = document.getElementById("siteTheme")
siteTheme.value = localStorage.getItem("theme.site") ?? "auto"
siteTheme.addEventListener("change", () => {
  localStorage.setItem("theme.site", siteTheme.value)

  const dcTheme = document.getElementById("dc-theme")
  if (dcTheme) {
    switch (siteTheme.value) {
      case "light":
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.light.css"
        break
      case "dark":
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.dark.css"
        break
      default:
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.css"
    }
  }
})
siteTheme.dispatchEvent(new Event("change"))