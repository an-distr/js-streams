# Environment

## Description
Get environment values.

## Example
https://an-js-streams.pages.dev/misc/Environment/test/test.html

## Usage
```ts
import { Environment } from "https://an-js-streams.pages.dev/mod.js" // or .ts

// Get the environment in which the script is running.
const runtime = Environment.runtime()

// Gets the brand name of the execution environment.
const brand = await Environment.brand()

// Gets the version of the execution environment.
const version = await Environment.version()
```