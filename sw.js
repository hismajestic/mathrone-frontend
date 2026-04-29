// Mathrone Academy — Service Worker
// ── HOW TO BUST THE CACHE ON NEW DEPLOY ─────────────────────────────────

// BUMPED TO v25
const CACHE = 'mathrone-v32';

const PRECACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/site.webmanifest',  
  '/favicon.ico',       
  '/icon-192x192.png',  
  '/icon-512x512.png',  
  '/screenshot-desktop.png', // <-- Added for the new Rich Install UI
  '/screenshot-mobile.png',  // <-- Added for the new Rich Install UI
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

  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

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

  var isStatic = /\.(js|css|png|jpg|jpeg|webp|svg|ico|webmanifest)$/.test(url.pathname);
  if (isStatic) {
    // SWR pattern for ultimate speed
    e.respondWith(
      caches.match(req).then(function(cached) {
        var fetchPromise = fetch(req).then(function(res) {
          if (res && res.status === 200) {
            var clone = res.clone();
            caches.open(CACHE).then(function(c) { c.put(req, clone); });
          }
          return res;
        }).catch(function() { return cached; });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // HTML Navigation fallback (SPA Offline Support)
  if (req.mode === 'navigate' || req.headers.get('accept').includes('text/html')) {
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
    return;
  }
});