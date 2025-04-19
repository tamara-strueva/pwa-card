const CACHE_NAME = 'visiting-card-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/app.js',
  '/images/photo.jpg',
  '/images/phone-qr.png',
  '/images/telegram-qr.png',
  '/images/vk-qr.png',
  '/images/icon-192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener("fetch", e => {
    e.respondWith(
      caches.match(e.request) // Пытаемся найти файл в кэше
        .then(r => r || fetch(e.request)) // Если нет — пробуем загрузить из интернета
        .catch(() => caches.match("/offline.html")) // Если совсем не удалось — показать offline.html
    );
});  

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});