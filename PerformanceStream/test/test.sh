#!/bin/sh

echo Run node
node --experimental-default-type=module test.js

echo Run deno
deno run --allow-hrtime test.ts

echo Run bun
bun test.ts