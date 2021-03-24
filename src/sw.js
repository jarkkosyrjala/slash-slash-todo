import { skipWaiting } from 'workbox-core'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

skipWaiting()
clientsClaim()

// Add cache assets
registerRoute(
  /\/icons\//,
  new CacheFirst({
    cacheName: 'assets-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 180,
        maxEntries: 300,
      }),
    ],
  }),
)

// Add cache rules for js files that have chunk info in url e.g. script.<chunk>.js
registerRoute(
  /\..*\.(js)$/i,
  new CacheFirst({
    cacheName: 'chunk-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 180,
        maxEntries: 100,
      }),
    ],
  }),
)

// Check for updates for the index.html
registerRoute(
  /^\/[^.]+$/,
  new StaleWhileRevalidate({
    cacheName: 'html',
  }),
)

self.__WB_MANIFEST
