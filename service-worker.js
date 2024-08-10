const CACHE_NAME = 'delivery-calculator-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon.png',
    './service-worker.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the request is in the cache, return it
                if (response) {
                    return response;
                }
                // If the request is not cached, fetch it from the network
                return fetch(event.request).catch(() => {
                    // Optionally, you can serve a fallback page for offline users
                    return caches.match('./index.html');
                });
            })
    );
});
