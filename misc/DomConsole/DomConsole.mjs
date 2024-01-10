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
export class DomConsole {
    constructor(owner, redirect, parent) {
        if (typeof owner === "string") {
            this.owner = document.getElementById(owner);
            this.owner.append(this.createContextMenu(this.owner));
            const scopedStyle = document.createElement("style");
            scopedStyle.setAttribute("scoped", "");
            scopedStyle.textContent = `
        .console-list>.console-list-item>label {
          display: block;
          cursor: pointer;
        }
        .console-list>.console-list-item:has(>label>input[type="checkbox"]:not(:checked))>.console-list {
          display: none;
        }
        .console-list>.console-list-item:has(>label>input[type="checkbox"]:checked)>.console-list {
          display: block;
        }`;
            this.owner.append(scopedStyle);
        }
        else {
            this.owner = owner;
        }
        this.redirect = redirect;
        this.parent = parent;
        this.holder = document.createElement("ul");
        this.holder.classList.add("console-list");
        this.owner.appendChild(this.holder);
    }
    dataToString(...data) {
        let lst = [];
        for (let i = 0; i < arguments.length; ++i) {
            switch (typeof data[i]) {
                case "string":
                    lst.push(data[i]);
                    break;
                case "number":
                case "bigint":
                case "boolean":
                    lst.push(data[i].toString());
                    break;
                case "undefined":
                    lst.push("undefined");
                    break;
                default:
                    if (Array.isArray(data[i])) {
                        const arr = data[i];
                        lst.push(`(${arr.length}) [${arr.map(v => this.dataToString(v)).join(", ")}]`);
                    }
                    else {
                        lst.push(JSON.stringify(data[i]));
                    }
                    break;
            }
        }
        return lst.join(" ");
    }
    appendItem(classSuffix, ...data) {
        const li = document.createElement("li");
        li.classList.add("console-list-item");
        if (classSuffix) {
            li.classList.add(`console-list-item-${classSuffix}`);
        }
        li.textContent = this.dataToString(...data);
        this.holder.append(li);
        return li;
    }
    toNextHolder(collapsed, ...data) {
        const current = this.appendItem("log", ...data);
        const chk = document.createElement("input");
        chk.name = "table-visibility";
        chk.type = "checkbox";
        chk.checked = !collapsed;
        const lbl = document.createElement("label");
        lbl.append(chk);
        lbl.append(current.innerHTML);
        current.innerHTML = "";
        current.append(lbl);
        this.child = new DomConsole(current, this.redirect, this);
    }
    createContextMenu(owner) {
        const menu = document.createElement("ul");
        menu.classList.add("console-menu");
        menu.style.display = "none";
        menu.style.position = "fixed";
        let target;
        owner.addEventListener("contextmenu", ev => {
            ev.preventDefault();
            const menu = owner.querySelector(".console-menu");
            if (!menu)
                return;
            menu.style.left = ev.pageX + "px";
            menu.style.top = ev.pageY - scrollY + "px";
            menu.style.display = "block";
            target = ev.target;
        });
        window.addEventListener("click", () => {
            const menu = owner.querySelector(".console-menu");
            if (!menu)
                return;
            menu.style.display = "none";
        });
        const addItem = (text, action) => {
            const item = document.createElement("li");
            item.textContent = text;
            item.onclick = () => {
                action(target);
                menu.style.display = "none";
            };
            menu.append(item);
        };
        addItem("Expand all", target => this.expand(true, target));
        addItem("Collapse all", target => this.expand(false, target));
        return menu;
    }
    expand(expand, owner, depth) {
        const chks = [...(owner !== null && owner !== void 0 ? owner : this.owner).querySelectorAll("input[name='table-visibility']")];
        const ancestors = (target) => {
            var _a;
            const ancestors = [];
            let current = target.parentElement;
            while (current) {
                if (current.tagName === "LI") {
                    const found = (_a = current.firstElementChild) === null || _a === void 0 ? void 0 : _a.firstElementChild;
                    if (found && found !== target) {
                        if (found.getAttribute("type") === "checkbox") {
                            ancestors.push(found);
                        }
                    }
                }
                current = current.parentElement;
            }
            return ancestors;
        };
        const ownerDepth = owner === undefined ? 0 : ancestors(owner).length;
        chks.forEach(chk => {
            let level = depth === undefined ? 0 : ancestors(chk).length - ownerDepth + depth;
            chk.checked = level >= 0 ? expand : !expand;
        });
    }
    group(...data) {
        var _a;
        if (this.child) {
            this.child.group(...data);
            return;
        }
        this.toNextHolder(false, ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.group(...data);
    }
    groupCollapsed(...data) {
        var _a;
        if (this.child) {
            this.child.groupCollapsed(...data);
            return;
        }
        this.toNextHolder(true, ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.groupCollapsed(...data);
    }
    groupEnd() {
        var _a;
        if (this.child) {
            this.child.groupEnd();
            return;
        }
        if (this.parent) {
            this.parent.child = undefined;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.groupEnd();
    }
    clear() {
        var _a;
        if (this.parent) {
            this.parent.clear();
            return;
        }
        const oldHolder = this.holder;
        const newHolder = oldHolder.cloneNode(false);
        this.owner.replaceChild(newHolder, oldHolder);
        this.holder = newHolder;
        this.child = undefined;
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.clear();
    }
    assert(condition, ...data) {
        var _a;
        if (this.child) {
            this.child.assert(condition, ...data);
            return;
        }
        if (condition !== undefined && !condition) {
            this.appendItem("assert", "Assertion failed:", ...data);
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.assert(...data);
    }
    log(...data) {
        var _a;
        if (this.child) {
            this.child.log(...data);
            return;
        }
        this.appendItem("log", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.log(...data);
    }
    trace(...data) {
        var _a;
        if (this.child) {
            this.child.trace(...data);
            return;
        }
        this.appendItem("trace", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.trace(...data);
    }
    debug(...data) {
        var _a;
        if (this.child) {
            this.child.debug(...data);
            return;
        }
        this.appendItem("debug", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.debug(...data);
    }
    info(...data) {
        var _a;
        if (this.child) {
            this.child.info(...data);
            return;
        }
        this.appendItem("info", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.info(...data);
    }
    warn(...data) {
        var _a;
        if (this.child) {
            this.child.warn(...data);
            return;
        }
        this.appendItem("warn", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.warn(...data);
    }
    error(...data) {
        var _a;
        if (this.child) {
            this.child.error(...data);
            return;
        }
        this.appendItem("error", ...data);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.error(...data);
    }
    createHeaderCell(textContent) {
        const headerCell = document.createElement("th");
        headerCell.textContent = textContent;
        return headerCell;
    }
    table(tabularData, properties) {
        var _a;
        if (this.child) {
            this.child.table(tabularData, properties);
            return;
        }
        const table = document.createElement("table");
        table.classList.add("console-list-item-table");
        const header = table.createTHead();
        const headerRow = header.insertRow(-1);
        headerRow.append(this.createHeaderCell("(index)"));
        if (Array.isArray(tabularData)) {
            for (const key in tabularData[0]) {
                if (properties) {
                    if (properties.indexOf(key) === -1) {
                        continue;
                    }
                }
                headerRow.append(this.createHeaderCell(key));
            }
        }
        else {
            headerRow.append(this.createHeaderCell("Value"));
        }
        const body = table.createTBody();
        if (tabularData) {
            if (Array.isArray(tabularData)) {
                let dataIndex = 0;
                for (const data of tabularData) {
                    const bodyRow = body.insertRow(-1);
                    bodyRow.insertCell(-1).textContent = dataIndex.toString();
                    for (const key in data) {
                        if (properties) {
                            if (properties.indexOf(key) === -1) {
                                continue;
                            }
                        }
                        bodyRow.insertCell(-1).textContent = data[key];
                    }
                    ++dataIndex;
                }
            }
            else {
                for (const key in tabularData) {
                    const bodyRow = body.insertRow(-1);
                    bodyRow.insertCell(-1).textContent = key;
                    bodyRow.insertCell(-1).textContent = tabularData[key];
                }
            }
        }
        const li = this.appendItem();
        li.append(table);
        this.holder.append(li);
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.table(tabularData, properties);
    }
    count(label) {
        var _a;
        if (this.child) {
            this.child.count(label);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.count(label);
    }
    countReset(label) {
        var _a;
        if (this.child) {
            this.child.countReset(label);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.countReset(label);
    }
    dir(item, options) {
        var _a;
        if (this.child) {
            this.child.dir(item, options);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.dir(item, options);
    }
    dirxml(...data) {
        var _a;
        if (this.child) {
            this.child.dirxml(...data);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.dirxml(...data);
    }
    time(label) {
        var _a;
        if (this.child) {
            this.child.time(label);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.time(label);
    }
    timeEnd(label) {
        var _a;
        if (this.child) {
            this.child.timeEnd(label);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.timeEnd(label);
    }
    timeLog(label, ...data) {
        var _a;
        if (this.child) {
            this.child.timeLog(label, ...data);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.timeLog(label, ...data);
    }
    timeStamp(label) {
        var _a;
        if (this.child) {
            this.child.timeStamp(label);
            return;
        }
        (_a = this.redirect) === null || _a === void 0 ? void 0 : _a.timeStamp(label);
    }
}
//# sourceMappingURL=DomConsole.mjs.map