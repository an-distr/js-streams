import * as pp from "../PushPull.ts"

(() => {
  console.group("PushPullStringQueue")
  const q = new pp.PushPullStringQueue()
  console.assert(q.length() === 0, "q.length() === 0:", q.length())
  console.assert(!q.more(), "!q.more():", q.more())
  q.push("123")
  console.assert(q.length() === 3, "q.length() === 3:", q.length())
  console.assert(q.more(), "q.more():", q.more())
  let s = q.pop()
  console.assert(q.length() === 2, "q.length() === 2:", q.length())
  console.assert(q.more(), "q.more():", q.more())
  console.assert(q.all() === "12", 'q.all() === "12":', q.all())
  console.assert(s === "3", 's === "3":', s)
  q.empty()
  console.assert(q.length() === 0, "q.length() === 0:", q.length())
  console.assert(!q.more(), "!q.more():", q.more())
  q.push("123456")
  console.assert(q.all() === "123456", 'q.all() === "123456":', q.all())
  s = q.splice(2, 1)
  console.assert(q.all() === "12456", 'q.all() === "12456":', q.all())
  console.assert(s === "3", 's === "3":', s)
  s = q.splice(-1)
  console.assert(q.all() === "1245", 'q.all() === "1245":', q.all())
  console.assert(s === "6", 's === "6":', s)
  s = q.splice(1)
  console.assert(q.all() === "1", 'q.all() === "1":', q.all())
  console.assert(s === "245", 's === "245":', s)
  console.groupEnd()
})();

(() => {
  console.group("PushPullArrayQueue")
  const q = new pp.PushPullArrayQueue<number>()
  console.assert(q.length() === 0, "q.length() === 0:", q.length())
  console.assert(!q.more(), "!q.more():", q.more());
  [1, 2, 3].forEach(n => q.push(n))
  console.assert(q.length() === 3, "q.length() === 3:", q.length())
  console.assert(q.more(), "q.more():", q.more())
  let s = [q.pop()]
  console.assert(q.length() === 2, "q.length() === 2:", q.length())
  console.assert(q.more(), "q.more():", q.more())
  console.assert(q.all().toString() === [1, 2].toString(), "q.all().toString() === [1, 2].toString():", q.all())
  console.assert(s.toString() === [3].toString(), "s.toString() === [3].toString():", s)
  q.empty()
  console.assert(q.length() === 0, "q.length() === 0:", q.length())
  console.assert(!q.more(), "!q.more():", q.more());
  [1, 2, 3, 4, 5, 6].forEach(n => q.push(n))
  console.assert(q.all().toString() === [1, 2, 3, 4, 5, 6].toString(), "q.all().toString() === [1, 2, 3, 4, 5, 6].toString():", q.all())
  s = q.splice(2, 1)
  console.assert(q.all().toString() === [1, 2, 4, 5, 6].toString(), "q.all().toString() === [1, 2, 4, 5, 6].toString():", q.all())
  console.assert(s.toString() === [3].toString(), "s.toString() === [3].toString():", s)
  s = q.splice(-1)
  console.assert(q.all().toString() === [1, 2, 4, 5].toString(), "q.all().toString() === [1, 2, 4, 5].toString():", q.all())
  console.assert(s.toString() === [6].toString(), "s.toString() === [6].toString():", s)
  s = q.splice(1)
  console.assert(q.all().toString() === [1].toString(), "q.all().toString() === [1].toString():", q.all())
  console.assert(s.toString() === [2, 4, 5].toString(), "s.toString() === [2, 4, 5].toString():", s)
  console.groupEnd()
})();