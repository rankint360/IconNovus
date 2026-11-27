export function GET(request: Request) {
  return Response.redirect(new URL("/cdn-cgi/access/logout", request.url), 302);
}
