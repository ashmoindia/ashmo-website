const CACHE_NAME = 'paper-moon-shell-v1';
const SHELL = [
  '/pm/',
  '/pm/offline/',
  '/pm/paper-moon.js',
  '/manifest.webmanifest',
  '/pm/icons/icon-192.png',
  '/pm/icons/icon-512.png',
  '/pm/icons/icon-maskable-512.png',
];

const networkOnly = (request) => fetch(request);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (
    request.method !== 'GET'
    || url.origin !== self.location.origin
    || url.pathname.startsWith('/api/pm/')
    || url.pathname.startsWith('/.netlify/functions/')
  ) {
    event.respondWith(networkOnly(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/pm/offline/')),
    );
    return;
  }

  const isStaticPiece = ['script', 'style', 'font', 'image', 'manifest'].includes(request.destination)
    || url.pathname === '/manifest.webmanifest';
  if (!isStaticPiece) {
    event.respondWith(networkOnly(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    })),
  );
});
