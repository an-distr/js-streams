/// <reference lib="deno.ns" />
import { $ } from "https://deno.land/x/dax@0.36.0/mod.ts"
import { expandGlob } from "https://deno.land/std@0.212.0/fs/expand_glob.ts"

// Transpiling.
console.log("Transpiling.")
try {
  await $`tsc --project tsconfig.build.json`
}
catch { }

// Replace import file extension.
console.log("Replace import file extension.")
for await (const file of expandGlob("../**/*.js")) {
  let text = await Deno.readTextFile(file.path)
  if (!text.includes(".ts\"")) continue
  text = text.replaceAll(".ts\"", ".js\"")
  await Deno.writeTextFile(file.path, text)
  console.log(file.path)
}