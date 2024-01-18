#!/bin/sh

tsc --project tsconfig.json
deno run --allow-read --allow-write build.ts