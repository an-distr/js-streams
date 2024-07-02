/*!
MIT No Attribution

Copyright 2024 an(https://github.com/an-distr)

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
class DomConsole {
  constructor(owner, redirect, parent) {
    if (typeof owner === "string") {
      this.owner = document.getElementById(owner);
    } else {
      this.owner = owner;
    }
    if (!("owner" in this.owner)) {
      this.owner.append(this.createContextMenu(this.owner));
      const scopedStyle = document.createElement("style");
      scopedStyle.setAttribute("scoped", "");
      scopedStyle.textContent = `
        .console-list {
          >.console-list-item>label {
            display: block;
          }
          >.console-list-item:has(>label>input[name="group-visibility"]:not(:checked))>.console-list {
            display: none;
          }
          >.console-list-item:has(>label>input[name="group-visibility"]:checked)>.console-list {
            display: block;
          }
        }`;
      this.owner.append(scopedStyle);
    }
    this.redirect = redirect;
    this.parent = parent;
    this.holder = document.createElement("ul");
    this.holder.classList.add("console-list");
    this.owner.appendChild(this.holder);
  }
  dataToString(...data) {
    const lst = [];
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
            lst.push(`(${arr.length}) [${arr.map((v) => this.dataToString(v)).join(", ")}]`);
          } else {
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
    const lbl = document.createElement("label");
    lbl.textContent = this.dataToString(...data);
    li.append(lbl);
    this.holder.append(li);
    return li;
  }
  toNextHolder(collapsed, ...data) {
    const current = this.appendItem("group", ...data);
    const chk = document.createElement("input");
    chk.name = "group-visibility";
    chk.type = "checkbox";
    chk.checked = !collapsed;
    current.firstElementChild.prepend(chk);
    this.child = new DomConsole(current, this.redirect, this);
  }
  createContextMenu(owner) {
    const menu = document.createElement("ul");
    menu.classList.add("console-menu");
    menu.style.display = "none";
    menu.style.position = "fixed";
    let target;
    owner.addEventListener("contextmenu", (ev) => {
      if (!ev.target?.parentElement?.classList.contains("console-list-item-group"))
        return;
      ev.preventDefault();
      const menu2 = owner.querySelector(".console-menu");
      if (!menu2)
        return;
      menu2.style.left = ev.pageX + "px";
      menu2.style.top = ev.pageY - scrollY + "px";
      menu2.style.display = "block";
      target = ev.target;
    });
    window.addEventListener("click", () => {
      const menu2 = owner.querySelector(".console-menu");
      if (!menu2)
        return;
      menu2.style.display = "none";
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
    addItem("Expand all", (target2) => this.expand(true, target2?.parentElement));
    addItem("Collapse all", (target2) => this.expand(false, target2?.parentElement));
    return menu;
  }
  withTrace(parent, error) {
    const callStack = (error.stack ?? "").replace("Error\n", "").split("\n").map((s) => s.trim().split(/[ |@|(|)]/).filter((s2) => !["at", ""].includes(s2)).join(" @ ")).map((s) => s.replace(location.href.replace(location.pathname, ""), "")).filter((s) => s.length > 0).filter((s) => !s.includes("trace @ ")).filter((s) => !s.includes("/DomConsole/DomConsole")).map((s) => s.includes(" @ ") ? s : "(anonymous) @ " + s);
    if (callStack.length > 0) {
      const callStackItem = document.createElement("ul");
      for (const stack of callStack) {
        const stackItem = document.createElement("li");
        stackItem.textContent = stack;
        callStackItem.append(stackItem);
      }
      parent.append(callStackItem);
    }
  }
  createHeaderCell(textContent) {
    const headerCell = document.createElement("th");
    headerCell.textContent = textContent;
    return headerCell;
  }
  getThis() {
    let This = this;
    while (This.child) {
      This = This.child;
    }
    return This;
  }
  expand(expand, owner, depth) {
    const chks = [...(owner ?? this.owner).querySelectorAll("input[name='group-visibility']")];
    const ancestors = (target) => {
      const ancestors2 = [];
      let current = target.parentElement;
      while (current) {
        if (current.tagName === "LI") {
          const found = current.firstElementChild?.firstElementChild;
          if (found && found !== target) {
            if (found.getAttribute("type") === "checkbox") {
              ancestors2.push(found);
            }
          }
        }
        current = current.parentElement;
      }
      return ancestors2;
    };
    const ownerDepth = owner === void 0 ? 0 : ancestors(owner).length;
    chks.forEach((chk) => {
      const level = depth === void 0 ? 0 : ancestors(chk).length - ownerDepth + depth;
      chk.checked = level >= 0 ? expand : !expand;
    });
  }
  group(...data) {
    const This = this.getThis();
    This.toNextHolder(false, ...data);
    This.redirect?.group(...data);
  }
  groupCollapsed(...data) {
    const This = this.getThis();
    This.toNextHolder(true, ...data);
    This.redirect?.groupCollapsed(...data);
  }
  groupEnd() {
    const This = this.getThis();
    if (This.parent)
      This.parent.child = void 0;
    This.redirect?.groupEnd();
  }
  clear() {
    const oldHolder = this.holder;
    const newHolder = oldHolder.cloneNode(false);
    this.owner.replaceChild(newHolder, oldHolder);
    this.holder = newHolder;
    this.child = void 0;
    this.redirect?.clear();
  }
  assert(condition, ...data) {
    const This = this.getThis();
    if (condition !== void 0 && !condition) {
      const item = This.appendItem("assert", "Assertion failed:", ...data);
      This.withTrace(item.firstElementChild, new Error());
      This.redirect?.assert(false, ...data);
    }
  }
  log(...data) {
    const This = this.getThis();
    This.appendItem("log", ...data);
    This.redirect?.log(...data);
  }
  trace(...data) {
    const This = this.getThis();
    const item = This.appendItem("trace", ...data);
    This.withTrace(item.firstElementChild, new Error());
    This.redirect?.trace(...data);
  }
  debug(...data) {
    const This = this.getThis();
    This.appendItem("debug", ...data);
    This.redirect?.debug(...data);
  }
  info(...data) {
    const This = this.getThis();
    This.appendItem("info", ...data);
    This.redirect?.info(...data);
  }
  warn(...data) {
    const This = this.getThis();
    const item = This.appendItem("warn", ...data);
    This.withTrace(item.firstElementChild, new Error());
    This.redirect?.warn(...data);
  }
  error(...data) {
    const This = this.getThis();
    const item = This.appendItem("error", ...data);
    This.withTrace(item.firstElementChild, new Error());
    This.redirect?.error(...data);
  }
  createTable(tabularData, properties) {
    const This = this.getThis();
    const table = document.createElement("table");
    table.classList.add("console-list-item-table");
    const header = table.createTHead();
    const headerRow = header.insertRow(-1);
    const columns = ["(index)"];
    if (Array.isArray(tabularData)) {
      for (const data of tabularData) {
        for (const key in data) {
          if (columns.includes(key)) {
            continue;
          }
          if (properties) {
            if (properties.indexOf(key) === -1) {
              continue;
            }
          }
          columns.push(key);
        }
      }
    } else {
      columns.push("Value");
    }
    for (const column of columns) {
      headerRow.append(This.createHeaderCell(column));
    }
    const body = table.createTBody();
    if (tabularData) {
      if (Array.isArray(tabularData)) {
        let dataIndex = 0;
        for (const data of tabularData) {
          const bodyRow = body.insertRow(-1);
          for (const _ of columns) {
            bodyRow.insertCell(-1);
          }
          bodyRow.cells[columns.indexOf("(index)")].textContent = dataIndex.toString();
          for (const key in data) {
            if (properties) {
              if (properties.indexOf(key) === -1) {
                continue;
              }
            }
            if (typeof data[key] === "object") {
              const table2 = this.createTable(data[key], properties);
              bodyRow.cells[columns.indexOf(key)].appendChild(table2);
            } else {
              bodyRow.cells[columns.indexOf(key)].textContent = data[key];
            }
          }
          ++dataIndex;
        }
      } else {
        for (const key in tabularData) {
          const bodyRow = body.insertRow(-1);
          for (const _ of columns) {
            bodyRow.insertCell(-1);
          }
          bodyRow.cells[columns.indexOf("(index)")].textContent = key;
          if (typeof tabularData[key] === "object") {
            const table2 = this.createTable(tabularData[key], properties);
            bodyRow.cells[columns.indexOf("Value")].appendChild(table2);
          } else {
            bodyRow.cells[columns.indexOf("Value")].textContent = tabularData[key];
          }
        }
      }
    }
    return table;
  }
  table(tabularData, properties) {
    const This = this.getThis();
    const table = This.createTable(tabularData, properties);
    const li = This.appendItem();
    li.firstElementChild.append(table);
    This.holder.append(li);
    This.redirect?.table(tabularData, properties);
  }
  /*! Redirect only. **/
  count(label) {
    const This = this.getThis();
    This.redirect?.count(label);
  }
  countReset(label) {
    const This = this.getThis();
    This.redirect?.countReset(label);
  }
  dir(item, options) {
    const This = this.getThis();
    This.redirect?.dir(item, options);
  }
  dirxml(...data) {
    const This = this.getThis();
    This.redirect?.dirxml(...data);
  }
  time(label) {
    const This = this.getThis();
    This.redirect?.time(label);
  }
  timeEnd(label) {
    const This = this.getThis();
    This.redirect?.timeEnd(label);
  }
  timeLog(label, ...data) {
    const This = this.getThis();
    This.redirect?.timeLog(label, ...data);
  }
  timeStamp(label) {
    const This = this.getThis();
    This.redirect?.timeStamp(label);
  }
}
export {
  DomConsole
};
//# sourceMappingURL=DomConsole.js.map
