/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-dist)

Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export var EnvironmentNames;
(function (EnvironmentNames) {
    EnvironmentNames[EnvironmentNames["Unknown"] = 0] = "Unknown";
    EnvironmentNames[EnvironmentNames["Browser"] = 1] = "Browser";
    EnvironmentNames[EnvironmentNames["Node"] = 2] = "Node";
    EnvironmentNames[EnvironmentNames["Deno"] = 3] = "Deno";
    EnvironmentNames[EnvironmentNames["Bun"] = 4] = "Bun";
})(EnvironmentNames || (EnvironmentNames = {}));
export class Environment {
    static env() {
        if (typeof Bun !== "undefined")
            return EnvironmentNames.Bun;
        if (typeof Deno !== "undefined")
            return EnvironmentNames.Deno;
        if (typeof process !== "undefined" && process.versions && process.versions.node)
            return EnvironmentNames.Node;
        if (typeof window !== "undefined" && window.navigator)
            return EnvironmentNames.Browser;
        return EnvironmentNames.Unknown;
    }
    static ver() {
        switch (this.env()) {
            case EnvironmentNames.Bun: return Bun.version;
            case EnvironmentNames.Deno: return Deno.version.deno;
            case EnvironmentNames.Node: return process.versions.node;
            case EnvironmentNames.Browser: return window.navigator.userAgent;
            default: return undefined;
        }
    }
}
//# sourceMappingURL=Environment.js.map