#!/bin/sh

echo Run node
node test.mjs

echo Run deno
deno run test.mts

echo Run bun
bun test.mts