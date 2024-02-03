(() => {

  if (location.host.split(".").length > 2) {
    document.title += ` (${location.host.split(".")[0]})`
  }

  const siteTheme = document.getElementById("siteTheme")
  siteTheme.value = localStorage.getItem("theme.site") ?? "auto"
  siteTheme.addEventListener("change", () => {
    localStorage.setItem("theme.site", siteTheme.value)
  })

})()