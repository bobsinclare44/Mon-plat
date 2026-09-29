export default async (request, context) => {
  try {
    const formData = await request.formData();
    const password = formData.get('password');
    const correctPassword = Netlify.env.get('SITE_PASSWORD');

    if (password && password === correctPassword) {
      return new Response('OK', {
        status: 200,
        headers: {
          'Set-Cookie': 'site_session=ok; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800'
        }
      });
    }
    return new Response('Mot de passe incorrect', { status: 401 });
  } catch (e) {
    return new Response('Erreur', { status: 500 });
  }
};