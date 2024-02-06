// @ts-ignore
import FastGlob from "fast-glob"
// @ts-ignore
import { intro, outro, select, isCancel } from "@clack/prompts"

const tests = [{
  value: undefined,
  label: "quit",
}].concat((await FastGlob("./dist/**/test.ts"))
  .sort()
  // @ts-ignore
  .map((file, index) => {
    return {
      value: file,
      label: `${index + 1}: ${file.split("/").slice(2, -1).join("/")}`,
    }
  }))

intro("Test runner.")

while (true) {
  const test = await select({
    message: "Choose test.",
    options: tests,
  })

  if (isCancel(test) || !test) {
    outro("Bye.")
    break
  }

  console.group(`Invoke ${test}`)
  await import(`${test}?version=${Date.now()}`)
  console.groupEnd()
}