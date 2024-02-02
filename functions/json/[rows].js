export function onRequest(context) {
  const rows = context.params.rows ?? 100
  if (rows < 0 || rows > 1000) {
    return Response.error()
  }

  const data = []
  for (let i = 0; i < 100; ++i) {
    data.push({
      id: i,
      name: `data {i}`,
    })
  }
  return Response.json(data)
}