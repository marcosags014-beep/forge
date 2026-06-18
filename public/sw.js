const CACHE = 'forge-v5'
const STATIC_CACHE = 'forge-static-v5'

// Only cache truly static assets (content-hashed filenames)
const isStaticAsset = url =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/icons/') ||
  url.pathname === '/manifest.json'

self.addEventListener('install', e => {
  // Skip waiting immediately so new SW takes over right away
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE && k !== STATIC_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  const url = new URL(e.request.url)

  // Never intercept API calls or cross-origin requests
  if (url.pathname.startsWith('/api/') || url.origin !== location.origin) return

  if (isStaticAsset(url)) {
    // Static assets: cache-first (they have content hashes so safe to cache forever)
    e.respondWith(
      caches.open(STATIC_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached
          return fetch(e.request).then(res => {
            if (res.ok) cache.put(e.request, res.clone())
            return res
          })
        })
      )
    )
  } else {
    // HTML pages: network-first — always get fresh HTML so new JS bundles load
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()))
          }
          return res
        })
        .catch(() => caches.match(e.request))
    )
  }
})
