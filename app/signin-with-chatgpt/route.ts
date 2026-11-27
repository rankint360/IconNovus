export function GET(request: Request) {
  const url = new URL(request.url);
  let target: URL;
  try {
    target = new URL(url.searchParams.get("return_to") ?? "/", url.origin);
  } catch {
    target = new URL("/", url.origin);
  }
  const safe = target.origin === url.origin && !["/signin-with-chatgpt", "/signout-with-chatgpt", "/callback"].includes(target.pathname);
  return Response.redirect(safe ? target : new URL("/", url.origin), 302);
}
