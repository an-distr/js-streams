import esbuild from "esbuild";
import fs from "node:fs";
import FastGlob from "fast-glob";
import asc from "assemblyscript/dist/asc.js";
console.group("Cleanup");
{
  const files = new Set(
    (await FastGlob("dist/{**,.**}/*.min.*")).concat(await FastGlob("dist/{**,.**}/*.map"))
  );
  console.log(files);
  for (const file of files) {
    fs.rmSync(file);
  }
}
console.groupEnd();
console.group("Transpiling. (build.ts -> build.js)");
{
  let file = "build.ts";
  console.log([file]);
  const options = {
    platform: "browser",
    format: "esm",
    entryPoints: [file],
    outdir: ".",
    allowOverwrite: true
  };
  const context = await esbuild.context(options);
  try {
    await context.rebuild();
  } finally {
    await context.dispose();
  }
}
console.groupEnd();
console.group("Transpiling. (build_sitemap.ts -> build_sitemap.js)");
{
  let file = "build_sitemap.ts";
  console.log([file]);
  const options = {
    platform: "browser",
    format: "esm",
    entryPoints: [file],
    outdir: ".",
    allowOverwrite: true
  };
  const context = await esbuild.context(options);
  try {
    await context.rebuild();
  } finally {
    await context.dispose();
  }
}
console.groupEnd();
console.group("Transpiling. (test_runner.ts -> test_runner.js)");
{
  let file = "test_runner.ts";
  console.log([file]);
  const options = {
    platform: "browser",
    format: "esm",
    entryPoints: [file],
    outdir: ".",
    allowOverwrite: true
  };
  const context = await esbuild.context(options);
  try {
    await context.rebuild();
  } finally {
    await context.dispose();
  }
  file = file.replace(".ts", ".js");
  let text = fs.readFileSync(file, "utf-8");
  text = text.replaceAll(".ts", ".js");
  fs.writeFileSync(file, text);
}
console.groupEnd();
console.group("Transpiling. (Native.ts -> Native.wasm)");
{
  const files = (await FastGlob("dist/{**,.**}/*Native.ts")).filter((x) => !x.includes("/functions/")).filter((x) => !x.includes(".min."));
  const license = `/*!
${fs.readFileSync("LICENSE", "utf-8")}
*/`;
  for (const file of files) {
    const wasm = file.replaceAll("Native.ts", "Native.wasm");
    const args = [
      file,
      "--outFile",
      wasm,
      "--bindings",
      "esm",
      "--sourceMap",
      "--target",
      "release",
      "--optimizeLevel",
      "3",
      "--shrinkLevel",
      "0",
      "--converge",
      "--noAssert"
      // "--target", "debug",
    ];
    console.log(file, args);
    const { error, stderr } = await asc.main(args);
    if (error) {
      console.error(stderr.toString());
      throw error;
    }
  }
}
console.groupEnd();
console.group("Transpiling. (.ts -> .js)");
{
  const files = (await FastGlob("dist/{**,.**}/*.ts")).filter((x) => !x.includes("/functions/")).filter((x) => !x.includes(".min.")).filter((x) => !x.includes("Native."));
  console.log(files);
  const options = {
    platform: "browser",
    format: "esm",
    entryPoints: files,
    outdir: "dist",
    allowOverwrite: true,
    sourcemap: "linked"
  };
  const context = await esbuild.context(options);
  try {
    await context.rebuild();
  } finally {
    await context.dispose();
  }
  for (const file of files.map((x) => x.replace(".ts", ".js"))) {
    let text = fs.readFileSync(file, "utf-8");
    text = text.replaceAll(".ts", ".js");
    fs.writeFileSync(file, text);
  }
}
console.groupEnd();
console.group("Transpiling. (.js -> .min.js)");
{
  const files = (await FastGlob("dist/{**,.**}/*.js")).filter((x) => !x.includes("/functions/")).filter((x) => !x.includes(".min."));
  console.log(files);
  for (let file of files) {
    const options = {
      platform: "browser",
      format: "esm",
      entryPoints: [file],
      outdir: file.split("/").slice(0, -1).join("/"),
      allowOverwrite: true,
      minify: true,
      sourcemap: "linked",
      loader: {
        ".js": "js"
      },
      outExtension: {
        ".js": ".min.js"
      }
    };
    const context = await esbuild.context(options);
    try {
      await context.rebuild();
    } finally {
      await context.dispose();
    }
    file = file.replace(".js", ".min.js");
    let text = fs.readFileSync(file, "utf-8");
    text = text.replaceAll(".min.js", ".min.xx");
    text = text.replaceAll(".js", ".min.js");
    text = text.replaceAll(".min.xx", ".min.js");
    fs.writeFileSync(file, text);
  }
}
console.groupEnd();
console.group("Transpiling. (.css -> .min.css)");
{
  const files = (await FastGlob("dist/{**,.**}/*.css")).filter((x) => !x.includes("/functions/")).filter((x) => !x.includes(".min."));
  console.log(files);
  for (let file of files) {
    const options = {
      platform: "browser",
      format: "esm",
      entryPoints: [file],
      outdir: file.split("/").slice(0, -1).join("/"),
      allowOverwrite: true,
      minify: true,
      sourcemap: "linked",
      loader: {
        ".css": "css"
      },
      outExtension: {
        ".css": ".min.css"
      }
    };
    const context = await esbuild.context(options);
    try {
      await context.rebuild();
    } finally {
      await context.dispose();
    }
    file = file.replace(".css", ".min.css");
    let text = fs.readFileSync(file, "utf-8");
    text = text.replaceAll(".min.css", ".min.xx");
    text = text.replaceAll(".css", ".min.css");
    text = text.replaceAll(".min.xx", ".min.css");
    fs.writeFileSync(file, text);
  }
}
console.groupEnd();
