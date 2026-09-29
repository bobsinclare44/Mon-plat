export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const formData = await request.formData();
  const password = formData.get('password');
  const correctPassword = env.CFP_PASSWORD;

  if (password && password === correctPassword) {
    return new Response('OK', {
      status: 200,
      headers: {
        'Set-Cookie': 'site_session=ok; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800'
      }
    });
  }
  return new Response('Mot de passe incorrect', { status: 401 });
}