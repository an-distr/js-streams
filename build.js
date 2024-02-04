import * as esbuild from "esbuild"
import { glob } from "glob"
import * as fs from "fs"

// Collect targets.
const tsFiles = (await glob("dist/**/*.ts")).filter(x => !x.includes("/functions/"))

// Transpiling.
console.group("Transpiling.")
{
  const options = {
    entryPoints: tsFiles,
    outdir: "dist",
    sourcemap: "linked",
  }
  const context = await esbuild.context(options)
  await context.rebuild()

  for (const jsFile of tsFiles.map(x => x.replace(".ts", ".js"))) {
    let text = fs.readFileSync(jsFile, "utf-8")
    text = text.replaceAll(".ts", ".js")
    fs.writeFileSync(jsFile, text)
  }
}
console.groupEnd()

// Transpiling. (min)
console.group("Transpiling. (min)")
{
  const options = {
    entryPoints: tsFiles,
    outdir: "dist",
    minify: true,
    outExtension: {
      ".js": ".min.js",
    },
    sourcemap: "linked",
  }
  const context = await esbuild.context(options)
  await context.rebuild()

  for (const jsFile of tsFiles.map(x => x.replace(".ts", ".min.js"))) {
    let text = fs.readFileSync(jsFile, "utf-8")
    text = text.replaceAll(".ts", ".min.js")
    fs.writeFileSync(jsFile, text)
  }
}
console.groupEnd()

// Exit.
process.exit()