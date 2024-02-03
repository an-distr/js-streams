import * as esbuild from "esbuild"
import { glob } from "glob"
import * as fs from "fs"

const tsFiles = (await glob("dist/**/*.ts"))
  .filter(x => !x.includes("/functions/"))

const jsFiles = tsFiles
  .map(x => x.replace(".ts", ".js"))

console.group("Transpiling.")
{
  const options = {
    entryPoints: tsFiles,
    outdir: "dist",
    minify: true,
    sourcemap: "linked",
  }

  const context = await esbuild.context(options)
  const result = await context.rebuild()

  console.log(result)
  console.log(`Transpiled ${result.outputFiles?.length} file(s).`)
}
console.groupEnd()

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

process.exit()