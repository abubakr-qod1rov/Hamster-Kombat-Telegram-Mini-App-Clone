// sw.js
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          // Offline uchun kerakli fayllar ro'yxati
          '/',
          '/index.html',
          '/static/js/bundle.js', // kerakli fayllarni qo'shishingiz mumkin
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });
  