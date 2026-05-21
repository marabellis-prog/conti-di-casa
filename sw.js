// Service Worker — Conti di Casa
// Strategia: stale-while-revalidate su risorse statiche + GET REST tabelle,
// network-only su mutazioni (POST/PATCH/DELETE) e su update_cache (gating).

const CACHE = 'conti-di-casa-v78';
const SUPA_HOST = 'lrvkchqvjzynfzevpqaj.supabase.co';
const CDN_HOST = 'cdn.jsdelivr.net'; // supabase-js + twemoji
const STATIC = [
  './',
  './index.html',
  './app.css',
  './app.js',
  './charts.js',
  './manifest.json',
  './icon.svg',
  './favicon.png',
  './favicon-32.png',
  './apple-touch-icon.png',
  './apple-touch-icon-76.png',
  './apple-touch-icon-120.png',
  './apple-touch-icon-152.png',
  './apple-touch-icon-167.png',
  './apple-touch-icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isSupabaseGet(req, url) {
  if (req.method !== 'GET') return false;
  if (url.host !== SUPA_HOST) return false;
  if (!url.pathname.startsWith('/rest/v1/')) return false;
  // gating timestamp: sempre rete
  if (url.pathname.includes('cdc_update_cache')) return false;
  // app_version: rete (cambia spesso, vogliamo sempre fresco)
  if (url.pathname.includes('cdc_app_version')) return false;
  // tabelle di lettura cache-abili
  return /\/rest\/v1\/cdc_(transazioni|categorie|budget|prefs)/.test(url.pathname);
}

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);

  // 1) Mutazioni / Realtime / Auth: network only, no cache
  if (req.method !== 'GET') return;

  // 2) Supabase GET su tabelle dati: stale-while-revalidate
  if (isSupabaseGet(req, url)) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const networkPromise = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || networkPromise;
    })());
    return;
  }

  // 3) Asset statici (same-origin): cache-first, fallback rete
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch (err) {
        const offline = await cache.match('./index.html');
        return offline || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // 4) CDN (jsdelivr: supabase-js, twemoji): stale-while-revalidate
  //    Velocizza enormemente il caricamento dopo la prima visita.
  if (url.host === CDN_HOST) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(req);
      const networkPromise = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          cache.put(req, res.clone()).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || networkPromise;
    })());
    return;
  }
  // 5) Altri cross-origin (es. Realtime ws): lascia passare
});
