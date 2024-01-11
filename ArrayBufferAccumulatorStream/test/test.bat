@echo off

if not exist ".result" (
  mkdir .result
)

echo Run node
node test.mjs > .result/node.txt

echo Run deno
deno run --allow-hrtime test.mts > .result/deno.txt