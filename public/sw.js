/*
 * Service worker kill-switch.
 *
 * The old Jekyll/Chirpy site ran as a PWA with offline caching enabled
 * (`pwa: { enabled: true, cache: { enabled: true } }`). Its service worker is
 * still registered on the fumbletable.com origin in any browser that visited
 * before the April 2026 Astro migration, and it serves pages cache-first --
 * so returning readers get a frozen March 2026 snapshot of the old site on a
 * normal refresh, and only see the real site on a hard refresh.
 *
 * Removing /sw.js was not enough: a 404 on the script during an update check
 * did not drop the registration in practice (a live "chirpy-*" cache was still
 * present four months later).
 *
 * So instead of serving nothing at this path, we serve a worker whose only job
 * is to dismantle itself. The old registration's periodic update check fetches
 * this file, sees different bytes, and installs it. On activation it deletes
 * every cache, unregisters itself, and reloads any open tab onto the live site.
 *
 * It deliberately has no fetch handler -- it must never serve anything.
 *
 * Keep this file indefinitely. Stale clients can come back months later.
 */

self.addEventListener('install', () => {
  // Take over from the old worker immediately rather than waiting for all
  // tabs using it to close.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1. Bin every cache on this origin, including the old "chirpy-*" ones.
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      // 2. Claim any open tabs still controlled by the old worker.
      await self.clients.claim();

      // 3. Remove this registration. Nothing intercepts requests after this.
      await self.registration.unregister();

      // 4. Reload open tabs so the reader lands on the real site now, rather
      //    than on whatever the old worker last handed them.
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        // navigate() can reject on cross-origin or already-unloading clients.
        try {
          await client.navigate(client.url);
        } catch {
          /* nothing useful to do -- the next navigation will be clean anyway */
        }
      }
    })()
  );
});
