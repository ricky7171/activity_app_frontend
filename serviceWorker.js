const staticCacheName = "dev-activity-app-v1"
const assets = [
  "/",
  "/css/style.min.css",
  "/css/sb-admin-2.min.css",
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticCacheName).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
        })
    )
})

