import FastGlob from "fast-glob";
import { intro, outro, select, isCancel } from "@clack/prompts";
const tests = Array.from([{
  value: "",
  label: "quit"
}]).concat((await FastGlob("./dist/**/test.js")).sort().map((file, index) => {
  return {
    value: file,
    label: `${index + 1}: ${file.split("/").slice(2, -1).join("/")}`
  };
}));
intro("Test runner.");
let prevTest = "";
while (true) {
  const test = await select({
    message: "Choose test.",
    options: tests,
    initialValue: prevTest
  });
  if (isCancel(test) || test === "") {
    outro("Bye.");
    break;
  }
  console.group(`Invoke ${test}`);
  await import(`${test}?version=${Date.now()}`);
  console.groupEnd();
  prevTest = test;
}
