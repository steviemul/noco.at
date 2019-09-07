const now = new Date();
const key = now.getFullYear() + now.getMonth() + now.getDate() + '-key';

const dataCacheName = 'weatherData-v1-' + key;
const cacheName = 'weatherPWA-final-1-' + key;
const filesToCache = [
  '/',
  '/index.html',
  '/js/bundle.js',
  '/js/materialize.min.js',
  '/css/style.css',
  '/css/materialize.min.css'
];

filesToCache.splice(0);

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', e => {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );

  return self.clients.claim();
});

self.addEventListener('fetch', e => {
  var dataUrl = '/api/lookup';
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(cache => {
        return fetch(e.request).then(response => {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});