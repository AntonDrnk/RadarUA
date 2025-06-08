const CACHE_NAME = 'speedcam-navigator-v3'; // Снова увеличим версию кэша

// Список файлов, которые нужно закэшировать
const urlsToCache = [
    './', // <-- ИЗМЕНЕНИЕ ЗДЕСЬ: заменяем '/' на './'
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'warning.mp3',
    'icon-192.png', // Убедитесь, что эти файлы есть в репозитории
    'icon-512.png',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js',
    'https://unpkg.com/leaflet-control-geocoder@1.13.0/dist/Control.Geocoder.css',
    'https://unpkg.com/leaflet-control-geocoder@1.13.0/dist/Control.Geocoder.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
