(() => {

  const siteTheme = document.getElementById("siteTheme")
  siteTheme.value = localStorage.getItem("theme.site") ?? "auto"
  siteTheme.addEventListener("change", () => {
    localStorage.setItem("theme.site", siteTheme.value)
  })

})()