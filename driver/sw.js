// Minimal service worker for the Driver app: makes it installable and keeps the page available offline.
// Only same-origin GET requests are handled. Data calls (Apps Script) always go straight to the network.
var CACHE = "satmola-driver-v2";
var SHELL = ["./", "./manifest.json", "./icon-192.png", "./icon-512.png", "./splash-plate.webp", "./splash-truck.webp"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch backend / CDN requests
  // Network first (so updates show up), cache as offline fallback
  e.respondWith(
    fetch(req).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(req, copy); });
      return res;
    }).catch(function () {
      return caches.match(req).then(function (hit) { return hit || caches.match("./"); });
    })
  );
});
