import * as esbuild from "esbuild"
import { glob } from "glob"
import * as fs from "fs"

// Collect targets.
const tsFiles = (await glob("dist/**/*.ts")).filter(x => !x.includes("/functions/"))
let jsFiles = tsFiles.map(x => x.replace(".ts", ".js"))
jsFiles = jsFiles.concat(jsFiles.map(x => x.replace(".js", ".min.js")))

// Transpiling.
console.group("Transpiling.")
{
  const options = {
    entryPoints: tsFiles,
    outdir: "dist",
    sourcemap: "linked",
  }
  const context = await esbuild.context(options)
  const result = await context.rebuild()
  console.log(result)
  console.log(`Transpiled ${result.outputFiles?.length} file(s).`)
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
  const result = await context.rebuild()
  console.log(result)
  console.log(`Transpiled ${result.outputFiles?.length} file(s).`)
}
console.groupEnd()

// Replace import extension.
console.group("Replace import extension.")
{
  for (const jsFile of jsFiles) {
    let text = fs.readFileSync(jsFile, "utf-8")
    text = text.replaceAll(".ts", ".js")
    fs.writeFileSync(jsFile, text)
  }
  console.log(`Extension replaced ${jsFiles.length} file(s).`)
}
console.groupEnd()

// Exit.
process.exit()