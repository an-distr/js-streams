@echo off

echo Run node
node test.mjs

echo Run deno
deno run --allow-hrtime test.mts