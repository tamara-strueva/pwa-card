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

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Возвращаем кэшированный ресурс, если он есть
          if (response) {
            return response;
          }
          
          // Для навигационных запросов возвращаем offline.html
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // Пробуем выполнить сетевой запрос
          return fetch(event.request).catch(() => {
            // Если это не навигационный запрос, но ресурс не найден в кэше
            // Можно вернуть заглушку или ничего не возвращать
            return new Response('Оффлайн-режим', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        })
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