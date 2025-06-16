const CACHE_NAME = 'taskmasterpro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.tsx',
  // Adicione outros arquivos importantes aqui
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
