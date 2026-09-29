export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/login.html' || url.pathname === '/check-password') {
    return next();
  }

  const cookie = request.headers.get('Cookie');
  if (cookie && cookie.includes('site_session=ok')) {
    return next();
  }

  return Response.redirect(new URL('/login.html', url), 302);
}