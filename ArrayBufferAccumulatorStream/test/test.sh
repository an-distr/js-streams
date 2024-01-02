#!/bin/sh

if [ ! -e .result ]; then
  mkdir .result
fi

echo Run node
node test.mjs > .result/node.txt

echo Run deno
deno run test.mts > .result/deno.txt

echo Run bun
bun test.mts > .result/bun.txt