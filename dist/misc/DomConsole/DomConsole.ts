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

export class DomConsole implements Console {
  private owner: HTMLElement
  private redirect?: Console
  private parent?: DomConsole
  private child?: DomConsole
  private holder: HTMLUListElement

  constructor(owner: HTMLElement | string, redirect?: Console, parent?: DomConsole) {
    if (typeof owner === "string") {
      this.owner = document.getElementById(owner)!
      this.owner.append(this.createContextMenu(this.owner))
    }
    else {
      this.owner = owner
    }
    if (!("owner" in (owner as any))) {
      const scopedStyle = document.createElement("style")
      scopedStyle.setAttribute("scoped", "")
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
        }`
      this.owner.append(scopedStyle)
    }
    this.redirect = redirect
    this.parent = parent
    this.holder = document.createElement("ul")
    this.holder.classList.add("console-list")
    this.owner.appendChild(this.holder)
  }

  private dataToString(...data: any[]) {
    const lst: string[] = []
    for (let i = 0; i < arguments.length; ++i) {
      switch (typeof data[i]) {
        case "string":
          lst.push(data[i])
          break
        case "number":
        case "bigint":
        case "boolean":
          lst.push(data[i].toString())
          break
        case "undefined":
          lst.push("undefined")
          break
        default:
          if (Array.isArray(data[i])) {
            const arr = data[i] as Array<any>
            lst.push(`(${arr.length}) [${arr.map(v => this.dataToString(v)).join(", ")}]`)
          }
          else {
            lst.push(JSON.stringify(data[i]))
          }
          break
      }
    }
    return lst.join(" ")
  }

  private appendItem(classSuffix?: string, ...data: any[]) {
    const li = document.createElement("li")
    li.classList.add("console-list-item")
    if (classSuffix) {
      li.classList.add(`console-list-item-${classSuffix}`)
    }
    const lbl = document.createElement("label")
    lbl.textContent = this.dataToString(...data)
    li.append(lbl)
    this.holder.append(li)
    return li
  }

  private toNextHolder(collapsed: boolean, ...data: any[]) {
    const current = this.appendItem("group", ...data)
    const chk = document.createElement("input")
    chk.name = "group-visibility"
    chk.type = "checkbox"
    chk.checked = !collapsed
    current.firstElementChild!.prepend(chk)
    this.child = new DomConsole(current, this.redirect, this)
  }

  private createContextMenu(owner: HTMLElement) {
    const menu = document.createElement("ul")
    menu.classList.add("console-menu")
    menu.style.display = "none"
    menu.style.position = "fixed"

    let target: EventTarget | null
    owner.addEventListener("contextmenu", ev => {
      if (!(ev.target as HTMLElement)?.parentElement?.classList.contains("console-list-item-group")) return
      ev.preventDefault()
      const menu = owner.querySelector(".console-menu") as HTMLUListElement | null
      if (!menu) return
      menu.style.left = ev.pageX + "px"
      menu.style.top = ev.pageY - scrollY + "px"
      menu.style.display = "block"
      target = ev.target
    })
    window.addEventListener("click", () => {
      const menu = owner.querySelector(".console-menu") as HTMLUListElement | null
      if (!menu) return
      menu.style.display = "none"
    })

    const addItem = (text: string, action: (target: EventTarget | null) => void) => {
      const item = document.createElement("li")
      item.textContent = text
      item.onclick = () => {
        action(target)
        menu.style.display = "none"
      }
      menu.append(item)
    }

    addItem("Expand all", target => this.expand(true, (target as Element)?.parentElement))
    addItem("Collapse all", target => this.expand(false, (target as Element)?.parentElement))

    return menu
  }

  private withTrace(parent: Element, error: Error) {
    const callStack = (error.stack ?? "")
      .replace("Error\n", "")
      .split("\n")
      .map(s => s.trim().split(/[ |@|(|)]/).filter(s2 => !["at", ""].includes(s2)).join(" @ "))
      .map(s => s.replace(location.href.replace(location.pathname, ""), ""))
      .filter(s => s.length > 0)
      .filter(s => !s.includes("trace @ "))
      .filter(s => !s.includes("/DomConsole/DomConsole"))
      .map(s => s.includes(" @ ") ? s : "(anonymous) @ " + s)

    if (callStack.length > 0) {
      const callStackItem = document.createElement("ul")
      for (const stack of callStack) {
        const stackItem = document.createElement("li")
        stackItem.textContent = stack
        callStackItem.append(stackItem)
      }
      parent.append(callStackItem)
    }
  }

  private createHeaderCell(textContent: string) {
    const headerCell = document.createElement("th")
    headerCell.textContent = textContent
    return headerCell
  }

  private getThis() {
    let This: DomConsole | undefined = this
    while (This.child) {
      This = This.child
    }
    return This
  }

  expand(expand: boolean, owner?: Element | null, depth?: number) {
    const chks = [...(owner ?? this.owner).querySelectorAll("input[name='group-visibility']")] as HTMLInputElement[]

    const ancestors = (target: Element) => {
      const ancestors: HTMLInputElement[] = []
      let current: HTMLElement | null = target.parentElement
      while (current) {
        if (current.tagName === "LI") {
          const found = current.firstElementChild?.firstElementChild
          if (found && found !== target) {
            if (found.getAttribute("type") === "checkbox") {
              ancestors.push(found as HTMLInputElement)
            }
          }
        }
        current = current.parentElement
      }
      return ancestors
    }

    const ownerDepth = owner === undefined ? 0 : ancestors(owner!).length
    chks.forEach(chk => {
      const level = depth === undefined ? 0 : ancestors(chk).length - ownerDepth + depth
      chk.checked = level >= 0 ? expand : !expand
    })
  }

  group(...data: any[]) {
    const This = this.getThis()
    This.toNextHolder(false, ...data)
    This.redirect?.group(...data)
  }

  groupCollapsed(...data: any[]) {
    const This = this.getThis()
    This.toNextHolder(true, ...data)
    This.redirect?.groupCollapsed(...data)
  }

  groupEnd() {
    const This = this.getThis()
    if (This.parent) This.parent.child = undefined
    This.redirect?.groupEnd()
  }

  clear() {
    const oldHolder = this.holder
    const newHolder = oldHolder.cloneNode(false)
    this.owner.replaceChild(newHolder, oldHolder)
    this.holder = newHolder as HTMLUListElement
    this.child = undefined
    this.redirect?.clear()
  }

  assert(condition?: boolean, ...data: any[]) {
    const This = this.getThis()
    if (condition !== undefined && !condition) {
      const item = This.appendItem("assert", "Assertion failed:", ...data)
      This.withTrace(item.firstElementChild!, new Error())
      This.redirect?.assert(false, ...data)
    }
  }

  log(...data: any[]) {
    const This = this.getThis()
    This.appendItem("log", ...data)
    This.redirect?.log(...data)
  }

  trace(...data: any[]) {
    const This = this.getThis()
    const item = This.appendItem("trace", ...data)
    This.withTrace(item.firstElementChild!, new Error())
    This.redirect?.trace(...data)
  }

  debug(...data: any[]) {
    const This = this.getThis()
    This.appendItem("debug", ...data)
    This.redirect?.debug(...data)
  }

  info(...data: any[]) {
    const This = this.getThis()
    This.appendItem("info", ...data)
    This.redirect?.info(...data)
  }

  warn(...data: any[]) {
    const This = this.getThis()
    const item = This.appendItem("warn", ...data)
    This.withTrace(item.firstElementChild!, new Error())
    This.redirect?.warn(...data)
  }

  error(...data: any[]) {
    const This = this.getThis()
    const item = This.appendItem("error", ...data)
    This.withTrace(item.firstElementChild!, new Error())
    This.redirect?.error(...data)
  }

  table(tabularData?: any, properties?: string[]) {
    const This = this.getThis()
    const table = document.createElement("table")
    table.classList.add("console-list-item-table")
    const header = table.createTHead()
    const headerRow = header.insertRow(-1)
    headerRow.append(This.createHeaderCell("(index)"))
    if (Array.isArray(tabularData)) {
      for (const key in tabularData[0]) {
        if (properties) {
          if (properties.indexOf(key) === -1) {
            continue
          }
        }
        headerRow.append(This.createHeaderCell(key))
      }
    }
    else {
      headerRow.append(This.createHeaderCell("Value"))
    }
    const body = table.createTBody()
    if (tabularData) {
      if (Array.isArray(tabularData)) {
        let dataIndex = 0
        for (const data of tabularData) {
          const bodyRow = body.insertRow(-1)
          bodyRow.insertCell(-1).textContent = dataIndex.toString()
          for (const key in data) {
            if (properties) {
              if (properties.indexOf(key) === -1) {
                continue
              }
            }
            bodyRow.insertCell(-1).textContent = data[key]
          }
          ++dataIndex
        }
      }
      else {
        for (const key in tabularData) {
          const bodyRow = body.insertRow(-1)
          bodyRow.insertCell(-1).textContent = key
          bodyRow.insertCell(-1).textContent = tabularData[key]
        }
      }
    }
    const li = This.appendItem()
    li.firstElementChild!.append(table)
    This.holder.append(li)
    This.redirect?.table(tabularData, properties)
  }

  /*! Redirect only. **/

  count(label?: string) {
    const This = this.getThis()
    This.redirect?.count(label)
  }

  countReset(label?: string) {
    const This = this.getThis()
    This.redirect?.countReset(label)
  }

  dir(item?: any, options?: any) {
    const This = this.getThis()
    This.redirect?.dir(item, options)
  }

  dirxml(...data: any[]) {
    const This = this.getThis()
    This.redirect?.dirxml(...data)
  }

  time(label?: string) {
    const This = this.getThis()
    This.redirect?.time(label)
  }

  timeEnd(label?: string) {
    const This = this.getThis()
    This.redirect?.timeEnd(label)
  }

  timeLog(label?: string, ...data: any[]) {
    const This = this.getThis()
    This.redirect?.timeLog(label, ...data)
  }

  timeStamp(label?: string) {
    const This = this.getThis()
    This.redirect?.timeStamp(label)
  }
}