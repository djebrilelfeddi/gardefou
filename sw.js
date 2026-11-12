/* Service worker de GardeFou : l'appli marche hors ligne et se met à jour.
   Le numéro de version est inséré automatiquement par GitHub à chaque publication. */
const VERSION = '__APP_VERSION__';
const CACHE = 'gardefou-' + VERSION;
const CORE = ['./', './index.html', './config.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('gardefou-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => { if (e.data === 'skipWaiting') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // version.json : toujours le réseau, jamais le cache
  if (url.origin === location.origin && url.pathname.endsWith('/version.json')) return;

  // fichiers de l'appli : réseau d'abord (toujours la dernière version), cache si hors ligne
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // polices Google et bibliothèque Firebase : cache d'abord, mis à jour en arrière-plan
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname) || (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) {
    e.respondWith(
      caches.open(CACHE).then(c => c.match(req).then(hit => {
        const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
  }
});
