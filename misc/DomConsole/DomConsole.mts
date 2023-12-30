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
  owner: Node
  parent: DomConsole | undefined
  child: DomConsole | undefined
  holder: HTMLUListElement

  constructor(owner: Node | string, parent?: DomConsole) {
    if (typeof owner === "string") {
      this.owner = document.getElementById(owner) as Node
    }
    else {
      this.owner = owner
    }
    this.parent = parent
    this.holder = document.createElement("ul")
    this.holder.classList.add("console-list")
    this.owner.appendChild(this.holder)
  }

  private dataToString(...data: any[]): string {
    let lst: string[] = []
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
            lst.push(`(${(data[i] as Array<any>).length}) ` + this.dataToString(...data[i]))
          }
          else {
            lst.push(JSON.stringify(data[i]))
          }
          break
      }
    }
    return lst.join(" ")
  }

  group(...data: any[]): void {
    if (this.child) {
      this.child.group(...data)
      return
    }
    this.log(...data)
    this.child = new DomConsole(this.holder, this)
  }

  groupCollapsed(...data: any[]): void {
    if (this.child) {
      this.child.group(...data)
      return
    }
    this.log(...data)
    this.child = new DomConsole(this.holder, this)
  }

  groupEnd(): void {
    if (this.child) {
      this.child.groupEnd()
      return
    }
    if (this.parent) {
      this.parent.child = undefined
    }
  }

  clear(): void {
    if (this.parent) {
      this.parent.clear()
      return
    }
    const oldHolder = this.holder
    const newHolder = oldHolder.cloneNode(false)
    this.owner.replaceChild(newHolder, oldHolder)
    this.holder = newHolder as HTMLUListElement
    this.child = undefined
  }

  assert(condition?: boolean | undefined, ...data: any[]): void {
    if (this.child) {
      this.child.assert(condition, ...data)
      return
    }
    if (condition !== undefined && !condition) {
      const li = document.createElement("li")
      li.classList.add("console-list-item", "console-list-item-assert")
      li.textContent = `assert: ${this.dataToString(data)}`
      this.holder.append(li)
      debugger
    }
  }

  log(...data: any[]): void {
    if (this.child) {
      this.child.log(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-log")
    li.textContent = `log: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  trace(...data: any[]): void {
    if (this.child) {
      this.child.trace(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-trace")
    li.textContent = `trace: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  debug(...data: any[]): void {
    if (this.child) {
      this.child.debug(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-debug")
    li.textContent = `debug: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  info(...data: any[]): void {
    if (this.child) {
      this.child.info(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-info")
    li.textContent = `info: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  warn(...data: any[]): void {
    if (this.child) {
      this.child.warn(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-warn")
    li.textContent = `warn: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  error(...data: any[]): void {
    if (this.child) {
      this.child.error(...data)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-error")
    li.textContent = `error: ${this.dataToString(data)}`
    this.holder.append(li)
  }

  table(tabularData?: any, properties?: string[] | undefined): void {
    if (this.child) {
      this.child.table(tabularData, properties)
      return
    }
    const li = document.createElement("li")
    li.classList.add("console-list-item", "console-list-item-log")
    const table = document.createElement("table")
    table.classList.add("console-list-item-table")
    const header = table.createTHead()
    const headerRow = header.insertRow(-1)
    if (Array.isArray(tabularData)) {
      headerRow.insertCell(-1).textContent = "(index)"
      for (const key in tabularData[0]) {
        if (properties) {
          if (properties.indexOf(key) === -1) {
            continue
          }
        }
        headerRow.insertCell(-1).textContent = key
      }
    }
    else {
      headerRow.insertCell(-1).textContent = "(key)"
      headerRow.insertCell(-1).textContent = "(value)"
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
    li.append(table)
    this.holder.append(li)
  }







  count(label?: string | undefined): void {
    throw new Error("Method not implemented.");
  }
  countReset(label?: string | undefined): void {
    throw new Error("Method not implemented.");
  }

  dir(item?: any, options?: any): void {
    throw new Error("Method not implemented.");
  }
  dirxml(...data: any[]): void {
    throw new Error("Method not implemented.");
  }

  time(label?: string | undefined): void {
    throw new Error("Method not implemented.");
  }
  timeEnd(label?: string | undefined): void {
    throw new Error("Method not implemented.");
  }
  timeLog(label?: string | undefined, ...data: any[]): void {
    throw new Error("Method not implemented.");
  }
  timeStamp(label?: string | undefined): void {
    throw new Error("Method not implemented.");
  }
}