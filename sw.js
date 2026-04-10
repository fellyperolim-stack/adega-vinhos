const CACHE_NAME = 'adega-v1';

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Aqui você pode colocar arquivos iniciais para cachear se quiser no futuro
            return cache.addAll(['/']); 
        })
    );
});

// Interceptando as requisições (necessário para ser PWA)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});