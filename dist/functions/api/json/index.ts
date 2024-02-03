export const onRequest: PagesFunction = async context => {
  const request = context.request
  const url = new URL(request.url)

  const rows = +(url.searchParams.get("rows") ?? "100")
  if (rows < 0 || rows > 10000) {
    return new Response("Out of range. 'rows' range is 0 to 10000.", { status: 400 })
  }

  const data = []
  for (let i = 1; i <= rows; ++i) {
    data.push({
      number: i,
      text: `text ${i}`,
    })
  }
  return Response.json(data)
}