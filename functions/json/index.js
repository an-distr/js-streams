export function onRequest(context) {
  const url = new URL(context.url)

  const rows = Number(url.searchParams.get("rows") ?? "100")
  if (rows < 0 || rows > 1000) {
    return Response.error()
  }

  const data = []
  for (let i = 0; i < rows; ++i) {
    data.push({
      id: i,
      name: `data {i}`,
    })
  }
  return Response.json(data)
}