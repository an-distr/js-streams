import FastGlob from "fast-glob"
import { intro, outro, select, isCancel } from "@clack/prompts"

type Test = {
  value: string
  label?: string
  hint?: string
}

const tests = Array.from<Test>([{
  value: "",
  label: "quit",
}]).concat((await FastGlob("./dist/**/test.ts"))
  .sort()
  .map<Test>((file, index) => {
    return {
      value: file,
      label: `${index + 1}: ${file.split("/").slice(2, -1).join("/")}`,
    }
  }))

intro("Test runner.")

let prevTest = ""
while (true) {
  const test = await select<Test[], string>({
    message: "Choose test.",
    options: tests,
    initialValue: prevTest,
  })

  if (isCancel(test) || test === "") {
    outro("Bye.")
    break
  }

  console.group(`Invoke ${test as string}`)
  await import(`${test as string}?version=${Date.now()}`)
  console.groupEnd()

  prevTest = test
}