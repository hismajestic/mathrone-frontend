export async function onRequest(context) {
  const { params, request, env } = context;
  const url = new URL(request.url);
  const rawPath = Array.isArray(params.path)
    ? params.path.join('/')
    : (params.path || '');

  const publicPath = (rawPath || '').replace(/^\/+/, '').replace(/^storage\/+/, '');
  if (!publicPath || publicPath.includes('..')) {
    return new Response('Not found', { status: 404, headers: { 'content-type': 'text/plain;charset=UTF-8' } });
  }

  const normalized = decodeURIComponent(publicPath)
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');

  const supabaseUrl = (env.SUPABASE_URL || 'https://hdpkjomganndiiprnpok.supabase.co').replace(/\/+$/, '');
  const assetUrl = `${supabaseUrl}/storage/v1/object/public/${normalized}`;

  try {
    const upstream = await fetch(assetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mathrone-Cloudflare-Proxy/1.0',
      },
    });

    if (!upstream.ok) {
      return new Response('Asset not found', { status: 404, headers: { 'content-type': 'text/plain;charset=UTF-8' } });
    }

    const headers = new Headers(upstream.headers);
    headers.set('Cache-Control', 'public, max-age=2592000, s-maxage=31536000, stale-while-revalidate=86400');
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('X-Proxy', 'mathrone-cloudflare-storage');

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (error) {
    return new Response('Storage unavailable', {
      status: 503,
      headers: { 'content-type': 'text/plain;charset=UTF-8' },
    });
  }
}
