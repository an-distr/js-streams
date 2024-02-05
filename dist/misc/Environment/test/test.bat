@echo off

if not exist ".result" (
  mkdir .result
)

echo Run node (.js)
node --experimental-default-type=module test.js > .result/node.js.txt 2>&1
echo Run node (.min.js)
node --experimental-default-type=module test.min.js > .result/node.min.js.txt 2>&1

echo Run deno (.js)
deno run --allow-all test.js > .result/deno.js.txt 2>&1
echo Run deno (.min.js)
deno run --allow-all test.min.js > .result/deno.min.js.txt 2>&1
echo Run deno (.ts)
deno run --allow-all test.ts > .result/deno.ts.txt 2>&1

echo Run bun (.js)
bun test.js > .result/bun.js.txt 2>&1
echo Run bun (.min.js)
bun test.min.js > .result/bun.min.js.txt 2>&1
echo Run bun (.ts)
bun test.ts > .result/bun.ts.txt 2>&1