export const onRequest: PagesFunction = async context => {
  const url = new URL(context.request.url)
  const response = await context.next()
  if (url.pathname.startsWith("/api")) {
    response.headers.set('Access-Control-Allow-Origin', url.host)
  }
  return response
}