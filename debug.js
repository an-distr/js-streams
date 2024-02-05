import FastGlob from "fast-glob"
import prompts from "prompts"

const files = (await FastGlob("./dist/**/test.js")).sort()

while (true) {

  console.group("Choose test index.")
  for (const x of files.map((file, index) => { return { file, index } })) {
    const title = x.file.split("/").slice(-2, -1)[0]
    console.log(`${x.index + 1}: ${title}`)
  }
  console.groupEnd()

  const inputIndex = await prompts({
    type: "number",
    name: "index",
    message: `[1-${files.length}, otherwise exit.]:`,
  })

  const index = inputIndex.index
  if (!index || index <= 0 || index > files.length) {
    break
  }

  console.group(`Invoke ${files[index - 1]}`)
  await import(`${files[index - 1]}?version=${Date.now()}`)
  console.groupEnd()

}