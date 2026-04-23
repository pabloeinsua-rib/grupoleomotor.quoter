self.addEventListener('install', (e) => {
    // Force immediate installation
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    // Claim clients immediately
    e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
    // Just pass through, but defining a fetch handler is required by Chrome to show PWA install prompt.
    // We do minimal caching or basic fetch.
    e.respondWith(fetch(e.request).catch(() => new Response('Offline')));
});
