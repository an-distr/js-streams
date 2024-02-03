(() => {

  if (location.host.split(".").length > 2) {
    document.title += ` (${location.host.split(".")[0]})`
    const h1 = document.getElementsByTagName("h1")[0]
    if (h1.textContent.length === 0) {
      h1.textContent = document.title
    }
  }

  const siteTheme = document.getElementById("siteTheme")
  siteTheme.value = localStorage.getItem("theme.site") ?? "auto"
  siteTheme.addEventListener("change", () => {
    localStorage.setItem("theme.site", siteTheme.value)
  })

})()