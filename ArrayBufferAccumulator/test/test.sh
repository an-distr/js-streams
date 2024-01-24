#!/bin/sh

if [ ! -e .result ]; then
  mkdir .result
fi

echo Run node
node --experimental-default-type=module test.js > .result/node.txt

echo Run deno
deno run --allow-all test.ts > .result/deno.txt

echo Run bun
bun test.ts > .result/bun.txt