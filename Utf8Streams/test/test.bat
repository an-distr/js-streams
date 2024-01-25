@echo off

echo Run node
node --experimental-default-type=module test.js

echo Run deno
deno run --allow-all test.ts

echo Run bun
bun test.ts