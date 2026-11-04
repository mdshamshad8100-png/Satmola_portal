// Minimal service worker for the main Satmola app: makes it installable and keeps the page available offline.
// Only same-origin GET requests are handled. Data calls (Apps Script) always go straight to the network.
var CACHE = "satmola-main-v1";
var SHELL = ["./index.html", "./manifest-main.json", "./main-icon-192.png", "./main-icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      // Only remove old copies of this app's own cache. Other apps' caches are left alone.
      return Promise.all(keys.filter(function (k) { return k.indexOf("satmola-main-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
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
      return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
    })
  );
});
