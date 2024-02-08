import fs from "node:fs";
import { JSDOM } from "jsdom";
const base = "https://an-js-streams.pages.dev";
const html = fs.readFileSync("dist/index.html", "utf-8");
const parser = new new JSDOM().window.DOMParser();
const doc = parser.parseFromString(html, "text/html");
const urls = [];
for (const link of [...doc.querySelectorAll("a")].map((a) => a.href)) {
  const url = new URL(link, base);
  if (!url.href.startsWith(base)) {
    continue;
  }
  urls.push(url);
}
const today = /* @__PURE__ */ new Date();
const lastmod = [
  today.getUTCFullYear().toString().padStart(4, "0"),
  (today.getUTCMonth() + 1).toString().padStart(2, "0"),
  today.getUTCDate().toString().padStart(2, "0")
].join("-");
console.group(`Detect ${urls.length} URL(s)`);
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
for (const url of urls.sort()) {
  let priority;
  let changefreq = "always";
  if (url.pathname === "/") {
    priority = 1;
    changefreq = "never";
  } else if (url.pathname.startsWith("/demo")) {
    priority = 0.9;
  }
  const item = {
    url: encodeURI(url.href),
    lastmod,
    priority: priority?.toFixed(1),
    changefreq
  };
  sitemap += `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>${item.priority ? `
    <priority>${item.priority}</priority>` : ""}${item.changefreq ? `
    <changefreq>${item.changefreq}</changefreq>` : ""}
  </url>`;
  console.log(item);
}
sitemap += `
</urlset>`;
console.groupEnd();
fs.writeFileSync("dist/sitemap.xml", sitemap, { encoding: "utf-8" });
const sitemapPath = new URL(base);
sitemapPath.pathname = "/sitemap.xml";
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${sitemapPath.href}</loc>
  </sitemap>
</sitemapindex>`;
fs.writeFileSync("dist/sitemap-index.xml", sitemapIndex, { encoding: "utf-8" });
