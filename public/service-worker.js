// CACHE_NAME embeds a per-build hash.  The BUILD-HASH placeholder below is
// replaced at build time by the `service-worker-precache` plugin in
// vite.config.ts, so every production build ships a byte-different service
// worker.  That is what makes the in-app update banner fire on routine
// deploys, and it gives each build its own cache so `activate` can safely
// drop the previous build's entries.  In dev the placeholder survives
// untouched, which is harmless: the SW is only registered in production
// builds (see useServiceWorkerUpdate).
const CACHE_NAME = 'rpg-character-sheet-__BUILD_HASH__';

// Build-time-injected precache list: the app shell plus the built entry
// JS/CSS (and their static import graph).  The same Vite plugin replaces the
// PRECACHE-MANIFEST token below with a literal array of URLs; the fallback
// keeps the raw public/ copy functional if it is ever served untransformed.
const PRECACHE_MANIFEST = self.__PRECACHE_MANIFEST || [
  '/',
  '/index.html',
  '/manifest.webmanifest',
];

self.addEventListener('install', (event) => {
  // Pre-warm the new cache with the full shell + entry assets BEFORE the old
  // cache is deleted in `activate`.  This is what keeps offline launches
  // working across version bumps: by the time the old per-build cache goes
  // away, the new one already holds everything the shell needs to boot.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_MANIFEST))
  );
  // Intentionally do NOT call skipWaiting() here.  We want the new SW to
  // stay in the "installed/waiting" state until the user explicitly opts in
  // via the in-app update banner.  That avoids asset-mismatch errors on
  // tabs that are already running the previous bundle.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      // clients.claim() participates in waitUntil so the SW cannot be
      // terminated between cache cleanup and claiming open pages.
      .then(() => self.clients.claim())
  );
});

// Only cache responses whose Content-Type matches what the request was
// actually for.  This is the guard against SPA-rewrite cache poisoning: a
// stale /assets/*.js request answered with index.html (HTML, 200) must never
// be stored under the script URL.
function contentTypeMatchesDestination(response, request) {
  const contentType = (response.headers.get('content-type') || '').toLowerCase();
  switch (request.destination) {
    case 'document':
      return contentType.includes('text/html');
    case 'script':
      return contentType.includes('javascript');
    case 'style':
      return contentType.includes('text/css');
    default:
      // Images, fonts, the manifest, plain fetch() calls, ...: anything is
      // acceptable except an HTML body masquerading under an asset URL.
      return !contentType.includes('text/html');
  }
}

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
    // Network-first for navigations so users always get the newest shell
    // when online.  Only OK HTML responses are cached — transient 404/500
    // or maintenance pages must not become the stored offline fallback.
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok && contentTypeMatchesDestination(response, request)) {
            const copy = response.clone();
            // Tie the cache write to the event so the SW is not terminated
            // mid-put (a lost write would silently degrade offline boots).
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            );
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          if (cachedPage) return cachedPage;
          // Fall back to the precached app shell. Derive the deploy base from
          // the worker's own scope so this resolves to "/" for root deploys
          // and "/windsurf-project/" on project pages — matching the
          // base-prefixed keys the precache plugin writes.
          const basePath = new URL(self.registration.scope).pathname;
          const cachedShell = await caches.match(basePath);
          if (cachedShell) return cachedShell;
          return caches.match(`${basePath}index.html`);
        })
    );
    return;
  }

  // For JS chunks, CSS, and other static assets: cache-first, with the
  // Content-Type guard above so SPA-rewritten HTML can never poison an
  // asset URL.
  event.respondWith(
    caches
      .match(request)
      .then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (
            response &&
            response.ok &&
            contentTypeMatchesDestination(response, request)
          ) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
            );
          }
          return response;
        });
      })
      // An asset that is neither cached nor reachable fails like a normal
      // network error.  Navigations never reach this handler, so falling
      // back to the cached shell here would only mask MIME-type failures.
      .catch(() => Response.error())
  );
});