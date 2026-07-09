// Service Worker — Conti di Casa
// Strategia: CODICE app (HTML/JS/CSS) network-first (sempre fresco online, cache
// offline) · GET REST tabelle stale-while-revalidate · icone/immagini cache-first
// · network-only su mutazioni (POST/PATCH/DELETE) e su update_cache (gating).

const CACHE = 'conti-di-casa-v199';
const SUPA_HOST = 'lrvkchqvjzynfzevpqaj.supabase.co';
const CDN_HOST = 'cdn.jsdelivr.net'; // supabase-js + twemoji
const STATIC = [
  './',
  './index.html',
  './app.css?v=199',
  './equity.js?v=199',
  './backup.js?v=199',
  './app.js?v=199',
  './charts.js?v=199',
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
  return /\/rest\/v1\/cdc_(transazioni|categorie|budget|prefs|lista_spesa|lista_todo|scadenze)/.test(url.pathname);
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

  // 3) Asset statici (same-origin)
  if (url.origin === self.location.origin) {
    // 3a) CODICE dell'app (HTML/CSS/JS + navigazione): NETWORK-FIRST.
    //     Online si prende sempre l'ultima versione (niente codice bloccato in
    //     cache); offline si ricade sulla cache. Risolve il bug "app.js vecchio".
    const isCode = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/') ||
                   /\.(html|js|css)$/.test(url.pathname);
    if (isCode) {
      e.respondWith((async () => {
        const cache = await caches.open(CACHE);
        try {
          const res = await fetch(req, { cache: 'reload' }); // bypassa la cache HTTP del browser
          if (res && res.ok) cache.put(req, res.clone()).catch(() => {});
          return res;
        } catch (err) {
          const cached = await cache.match(req);
          return cached || (await cache.match('./index.html')) || new Response('Offline', { status: 503 });
        }
      })());
      return;
    }
    // 3b) Altri asset (icone, manifest, immagini): cache-first, fallback rete
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
