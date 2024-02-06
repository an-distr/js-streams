if (location.host.startsWith("localhost") || location.host.startsWith("127.0.0.1")) {
  document.title += " (local)"
}
else if (location.host.split(".").length > 3) {
  document.title += ` (${location.host.split(".")[0]})`
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
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.light.min.css"
        break
      case "dark":
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.dark.min.css"
        break
      default:
        dcTheme.href = "/misc/DomConsole/DomConsole.theme.chrome.min.css"
    }
  }
})
siteTheme.dispatchEvent(new Event("change"))

const toTop = document.createElement("a")
toTop.style.position = "fixed"
toTop.style.bottom = "0"
toTop.style.right = "0"
toTop.style.marginBottom = "1rem"
toTop.style.marginRight = "1rem"
toTop.style.cursor = "pointer"
toTop.textContent = "Top"
toTop.onclick = () => {
  window.scroll({ top: 0 })
}
document.body.append(toTop)