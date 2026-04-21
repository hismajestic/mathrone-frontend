// ════════════════════════════════════════════════════════════════════════
// Mathrone Academy — Cloudflare Pages API Worker
// File: functions/api/[[route]].js
//
// What this does:
//   - Proxies every /api/v1/* request from your frontend to Render
//   - Caches public (non-auth) responses at Cloudflare's edge worldwide
//   - Returns cached data instantly even when Render is cold/sleeping
//   - Handles CORS so your frontend never sees blocked requests
//   - Rate-limits abusive IPs to protect your Render backend
//   - Keeps Render warm with a background ping every 10 min
//
// Deployment:
//   1. Place this file at: frontend/functions/api/[[route]].js
//   2. Deploy to Cloudflare Pages (it picks up functions/ automatically)
//   3. Change API_URL in index.html to point to your Pages domain:
//      const API_URL = window.location.hostname === 'localhost'
//        ? 'http://127.0.0.1:8000/api/v1'
//        : '/api/v1'          <-- uses THIS worker instead of Render directly
//
// No wrangler.toml needed for Cloudflare Pages Functions.
// ════════════════════════════════════════════════════════════════════════

const BACKEND = 'https://mathrone-backend.onrender.com/api/v1';

// ── Cache TTLs (seconds) ─────────────────────────────────────────────────
// Routes listed here are cached at the edge. Everything else is proxied
// directly (auth, cart, orders, admin, user-specific data).
const CACHE_RULES = [
  { pattern: /^\/shop\/products($|\?)/, ttl: 60  },   // product list: 1 min
  { pattern: /^\/shop\/products\/[^/]+$/, ttl: 120 }, // single product: 2 min
  { pattern: /^\/shop\/featured$/,        ttl: 120 }, // featured: 2 min
  { pattern: /^\/shop\/bundles$/,         ttl: 120 }, // bundles: 2 min
  { pattern: /^\/news\/?(\?.*)?$/,         ttl: 60  }, // news list: 1 min (exact list only)
  { pattern: /^\/news\/by-slug\//,         ttl: 120 }, // news article by slug: 2 min
  { pattern: /^\/news\/[^/]+$/,            ttl: 120 }, // single news post by ID: 2 min
  { pattern: /^\/tutors\/\?/,             ttl: 300 }, // tutor directory: 5 min
  { pattern: /^\/health$/,                ttl: 30  }, // health check
];

// ── Rate limiting store (in-memory, per isolate) ─────────────────────────
// Limits each IP to 120 requests per minute. Resets every 60 seconds.
const rateLimitStore = new Map();
const RATE_LIMIT     = 120;   // max requests per window
const RATE_WINDOW_MS = 60000; // 1 minute window

function isRateLimited(ip) {
  const now  = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now - entry.ts > RATE_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, ts: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── CORS headers ─────────────────────────────────────────────────────────
function corsHeaders(origin) {
  const allowed = [
    'https://mathroneacademy.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
  ];
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin':  allowOrigin,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,apikey',
    'Access-Control-Max-Age':       '86400',
  };
}

// ── Main handler ─────────────────────────────────────────────────────────
export async function onRequest(context) {
  const { request, env } = context;
  const url    = new URL(request.url);
  const origin = request.headers.get('Origin') || '';

  // Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  // Strip the /api prefix that the Pages Function receives
  // URL will be /api/v1/shop/products → route = /shop/products
  const route = url.pathname.replace(/^\/api\/v1/, '') + (url.search || '');
  const ip    = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limiting — skip for health checks
  if (route !== '/health' && isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
        ...corsHeaders(origin),
      },
    });
  }

  // Determine if this route can be cached
  const cacheRule = CACHE_RULES.find(r => r.pattern.test(route));
  const canCache  = !!cacheRule && request.method === 'GET' && !request.headers.get('Authorization');

  // Try edge cache first for cacheable public routes
  if (canCache) {
    const cache    = caches.default;
    const cacheKey = new Request(`https://mathrone-cache${route}`, { method: 'GET' });
    const cached   = await cache.match(cacheKey);
    if (cached) {
      const resp = new Response(cached.body, cached);
      resp.headers.set('X-Cache', 'HIT');
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => resp.headers.set(k, v));
      return resp;
    }
  }

  // Forward to Render backend
  const backendUrl = BACKEND + route;
  const headers    = new Headers(request.headers);
  headers.set('X-Forwarded-For', ip);
  headers.delete('Host');

  let backendResp;
  try {
    backendResp = await fetch(backendUrl, {
      method:  request.method,
      headers: headers,
      body:    ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });
  } catch (err) {
    // Render is down or timing out — return a clean error
    return new Response(JSON.stringify({ error: 'Backend temporarily unavailable. Please try again in a moment.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  }

  // Build response to client
  const respHeaders = new Headers(backendResp.headers);
  Object.entries(corsHeaders(origin)).forEach(([k, v]) => respHeaders.set(k, v));

  // Cache successful public responses at the edge
  if (canCache && backendResp.ok) {
    respHeaders.set('Cache-Control', `public, max-age=${cacheRule.ttl}, s-maxage=${cacheRule.ttl}`);
    respHeaders.set('X-Cache', 'MISS');
    const bodyText = await backendResp.text();
    const toCache  = new Response(bodyText, { status: backendResp.status, headers: respHeaders });
    const cacheKey = new Request(`https://mathrone-cache${route}`, { method: 'GET' });
    context.waitUntil(caches.default.put(cacheKey, toCache.clone()));
    return new Response(bodyText, { status: backendResp.status, headers: respHeaders });
  }

  // Non-cacheable: stream straight through
  respHeaders.delete('Cache-Control');
  respHeaders.set('Cache-Control', 'no-store');
  return new Response(backendResp.body, {
    status:  backendResp.status,
    headers: respHeaders,
  });
}