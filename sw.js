// Mathrone Academy — Service Worker
// ── HOW TO BUST THE CACHE ON NEW DEPLOY ─────────────────────────────────
// Increment CACHE version string (e.g. v1 → v2) whenever you deploy
// new JS/CSS. Cloudflare Pages auto-serves the new sw.js (no-cache header)
// and the activate handler deletes the old cache automatically.
// ─────────────────────────────────────────────────────────────────────────
const CACHE = 'mathrone-v22';

const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/favicon.png',
  '/assets/fonts.css',
  '/assets/fonts/dm-sans-400.woff2',
  '/components/landing.js',
  '/components/auth.js',
  '/components/shop.js',
  '/components/courses.js',
  '/components/news.js',
  '/components/dashboards.js',
];

// Install: precache all critical files
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PRECACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: delete old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: Cache-First for static assets, Network-First for everything else
self.addEventListener('fetch', function(e) {
  var req = e.request;
  var url = new URL(req.url);

  // Skip non-GET and cross-origin API calls (Supabase, backend)
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Cache-First for fonts only — these never change
  var isFont = /\.(woff2|woff)$/.test(url.pathname);

  if (isFont) {
    e.respondWith(
      caches.match(req).then(function(cached) {
        return cached || fetch(req).then(function(res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE).then(function(c) { c.put(req, clone); });
          }
          return res;
        });
      })
    );
    return;
  }

  // TRUE Network-First for JS, CSS, images
  var isStatic = /\.(js|css|png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname);

  if (isStatic) {
    e.respondWith(
      fetch(req).then(function(res) {
        // 1. If the network works, save the newest version to cache and serve it
        if (res && res.status === 200) {
          var clone = res.clone();
          caches.open(CACHE).then(function(c) { c.put(req, clone); });
        }
        return res;
      }).catch(function() {
        // 2. If the network fails (offline), fall back to the cached version
        return caches.match(req);
      })
    );
    return;
  }

  // Network-First for HTML (SPA routes) — fall back to cached index.html when offline
  e.respondWith(
    fetch(req).then(function(res) {
      if (res && res.status === 200) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(req, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match('/index.html');
    })
  );
});