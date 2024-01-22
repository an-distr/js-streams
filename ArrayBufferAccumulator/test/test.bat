@echo off

if not exist ".result" (
  mkdir .result
)

echo Run node
node --experimental-default-type=module test.js > .result/node.txt

echo Run deno
deno run --allow-hrtime test.ts > .result/deno.txt

echo Run bun
bun test.ts > .result/bun.txt