export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'GET') {
    const ratings = await env.RATINGS.get('data', { type: 'json' }) || {};
    return new Response(JSON.stringify(ratings), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const productId = body.productId;
      const stars = parseInt(body.stars, 10);

      if (!productId || !stars || stars < 1 || stars > 5) {
        return new Response(JSON.stringify({ error: 'Invalide' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      const cookieHeader = request.headers.get('Cookie') || '';
      const cookieName = 'rated_' + productId.replace(/[^a-zA-Z0-9]/g, '_');
      if (cookieHeader.indexOf(cookieName + '=1') !== -1) {
        return new Response(JSON.stringify({ error: 'Deja vote' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
      }

      const ratings = await env.RATINGS.get('data', { type: 'json' }) || {};

      if (!ratings[productId]) {
        ratings[productId] = { total: 0, count: 0 };
      }

      ratings[productId].total += stars;
      ratings[productId].count += 1;

      await env.RATINGS.put('data', JSON.stringify(ratings));

      const average = (ratings[productId].total / ratings[productId].count).toFixed(1);
      return new Response(JSON.stringify({
        success: true,
        average: average,
        count: ratings[productId].count
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookieName + '=1; Path=/; Max-Age=31536000; SameSite=Lax'
        }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Erreur serveur' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
