export default async (request, context) => {
  const url = new URL(request.url);

  if (url.pathname === '/login' || url.pathname === '/check-password' || url.pathname === '/login.html') {
    return context.next();
  }

  const cookie = context.cookies.get('site_session');
  if (cookie === 'ok') {
    return context.next();
  }

  return Response.redirect(new URL('/login.html', url), 302);
};