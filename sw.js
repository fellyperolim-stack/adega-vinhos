/* Service worker da Adega Fellype & Hwlly
   - Shell do site: cache-first (rápido e offline)
   - Dados da planilha: sempre pela rede (o cache de dados fica no nav.js) */

const CACHE_NAME = 'adega-v10';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/catalogo.html',
  '/cadastro.html',
  '/melhores.html',
  '/paises.html',
  '/uvas.html',
  '/vinicolas.html',
  '/stats.html',
  '/games.html',
  '/shared.css',
  '/nav.js',
  '/manifest.json',
  '/assets/favicon.svg',
  '/assets/wine-placeholder.svg',
  '/assets/avatar-fallback.svg',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Dados vivos (Google Apps Script) nunca são servidos do cache
  if (url.hostname.includes('script.google.com')) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return response;
      }).catch(() => (req.mode === 'navigate' ? caches.match('/index.html') : undefined));
    })
  );
});
