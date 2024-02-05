import * as esbuild from "esbuild"
import { glob } from "glob"
import * as fs from "fs"
import * as path from "path"

// Transpiling. (.ts -> .js)
console.group("Transpiling. (.ts -> .js)")
{
  const files = (await glob("dist/{**,.**}/*.ts"))
    .filter(x => !x.includes("/functions/"))
    .filter(x => !x.includes(".min."))
  console.log(files)

  const options = {
    platform: "browser",
    format: "esm",
    entryPoints: files,
    outdir: "dist",
    sourcemap: "linked",
  }
  const context = await esbuild.context(options)
  await context.rebuild()

  for (const file of files.map(x => x.replace(".ts", ".js"))) {
    let text = fs.readFileSync(file, "utf-8")
    text = text.replaceAll(".ts", ".js")
    fs.writeFileSync(file, text)
  }
}
console.groupEnd()

// Transpiling. (.js -> .min.js)
console.group("Transpiling. (.js -> .min.js)")
{
  const files = (await glob("dist/{**,.**}/*.js"))
    .filter(x => !x.includes("/functions/"))
    .filter(x => !x.includes(".min."))
  console.log(files)

  for (let file of files) {
    const options = {
      platform: "browser",
      format: "esm",
      entryPoints: [file],
      outdir: file.split(path.sep).slice(0, -1).join(path.sep),
      minify: true,
      sourcemap: "linked",
      loader: {
        ".js": "js",
      },
      outExtension: {
        ".js": ".min.js",
      }
    }
    const context = await esbuild.context(options)
    await context.rebuild()

    file = file.replace(".js", ".min.js")
    let text = fs.readFileSync(file, "utf-8")
    text = text.replaceAll(".min.js", ".min.xx")
    text = text.replaceAll(".js", ".min.js")
    text = text.replaceAll(".min.xx", ".min.js")
    fs.writeFileSync(file, text)
  }
}
console.groupEnd()

// Transpiling. (.css -> .min.css)
console.group("Transpiling. (.css -> .min.css)")
{
  const files = (await glob("dist/{**,.**}/*.css"))
    .filter(x => !x.includes("/functions/"))
    .filter(x => !x.includes(".min."))
  console.log(files)

  for (let file of files) {
    const options = {
      platform: "browser",
      format: "esm",
      entryPoints: [file],
      outdir: file.split(path.sep).slice(0, -1).join(path.sep),
      minify: true,
      sourcemap: "linked",
      loader: {
        ".css": "css",
      },
      outExtension: {
        ".css": ".min.css",
      }
    }
    const context = await esbuild.context(options)
    await context.rebuild()

    file = file.replace(".css", ".min.css")
    let text = fs.readFileSync(file, "utf-8")
    text = text.replaceAll(".min.css", ".min.xx")
    text = text.replaceAll(".css", ".min.css")
    text = text.replaceAll(".min.xx", ".min.css")
    fs.writeFileSync(file, text)
  }
}
console.groupEnd()

// Exit.
process.exit()