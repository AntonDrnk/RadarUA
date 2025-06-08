const CACHE_NAME = 'speedcam-navigator-v2'; // Увеличим версию кэша
// Список файлов, которые нужно закэшировать
const urlsToCache = [
    '/',
    'index.html',
    'style.css',
    'app.js',
    'manifest.json', // Добавим манифест в кэш
    'warning.mp3',
    // УДАЛИЛИ НЕНУЖНЫЕ user-icon.svg и camera-icon.svg
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css',
    'https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js',
    'https://unpkg.com/leaflet-control-geocoder@1.13.0/dist/Control.Geocoder.css',
    'https://unpkg.com/leaflet-control-geocoder@1.13.0/dist/Control.Geocoder.js'
];

// Установка Service Worker и кэширование файлов
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Перехват сетевых запросов и отдача из кэша
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Если ресурс есть в кэше, отдаем его
                if (response) {
                    return response;
                }
                // Иначе, делаем обычный сетевой запрос
                return fetch(event.request);
            }
        )
    );
});

// Удаление старых кэшей
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