import { Environment, EnvironmentNames } from "../Environment.ts"

console.log("env:", EnvironmentNames[Environment.env()])
console.log("ver:", Environment.ver())