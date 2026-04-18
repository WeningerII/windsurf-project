// Bump CACHE_NAME whenever the app shell contract changes.  On activate the
// SW deletes any cache whose name does not match, so bumping this string is
// how old per-release chunks get pruned.
const CACHE_NAME = 'rpg-character-sheet-v3';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  // Intentionally do NOT call skipWaiting() here.  We want the new SW to
  // stay in the "installed/waiting" state until the user explicitly opts in
  // via the in-app update banner.  That avoids asset-mismatch errors on
  // tabs that are already running the previous bundle.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Message contract with the app:
//   { type: 'SKIP_WAITING' } — user accepted the update banner.  Activate
//                              the new SW immediately so the follow-up
//                              reload loads fresh bytes.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  // Handle Vite's HMR and dev server requests (skip caching)
  if (requestUrl.pathname.startsWith('/@') || requestUrl.pathname.includes('node_modules')) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For JS chunks, CSS, and other static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Cache successful responses for our own assets
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});

// Allow clients to tell the SW to cache specific system chunks proactively
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.allSettled(
          urlsToCache.map((url) => {
            return cache.match(url).then((existing) => {
              if (!existing) {
                return fetch(url).then((response) => {
                  if (response.ok) {
                    return cache.put(url, response.clone());
                  }
                });
              }
            });
          })
        );
      })
    );
  }
});