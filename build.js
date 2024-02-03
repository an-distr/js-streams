import * as esbuild from "esbuild"
import { glob } from "glob"

const sources = (await glob("dist/**/*.ts"))
  .filter(x => !x.includes("/functions/"))

const options = {
  entryPoints: sources,
  outdir: "dist",
  minify: true,
  sourcemap: "linked",
}

const context = await esbuild.context(options)
await context.rebuild()