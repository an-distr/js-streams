/// <reference lib="deno.ns" />
import { expandGlob } from "https://deno.land/std@0.212.0/fs/expand_glob.ts"

for await (const file of expandGlob("../**/*.js")) {
  let text = await Deno.readTextFile(file.path)
  if (!text.includes(".ts\"")) continue
  text = text.replaceAll(".ts\"", ".js\"")
  await Deno.writeTextFile(file.path, text)
  console.log(`Convert: ${file.path}`)
}