/// <reference lib="deno.ns" />
import { $ } from "https://deno.land/x/dax@0.36.0/mod.ts"
import { expandGlob } from "https://deno.land/std@0.212.0/fs/expand_glob.ts"

// Transpiling.
console.log("Transpiling.")
try {
  await $`tsc --project tsconfig.json`
}
catch { }

// Replace import file extension.
console.log("Replace import file extension.")
const jsFiles = expandGlob("../**/*.js")
for await (const jsFile of jsFiles) {
  let text = await Deno.readTextFile(jsFile.path)
  if (!text.includes(".ts\"")) continue
  text = text.replaceAll(".ts\"", ".js\"")
  await Deno.writeTextFile(jsFile.path, text)
  console.log(jsFile.path)
}