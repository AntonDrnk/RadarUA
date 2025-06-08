document.addEventListener('DOMContentLoaded', () => {
    // --- ЭЛЕМЕНТЫ ИНТЕРФЕЙСА ---
    const SPEED_VALUE_EL = document.getElementById('speed-value');
    const ADDRESS_EL = document.getElementById('camera-address');
    const DISTANCE_EL = document.getElementById('camera-distance');
    const ALERT_EL = document.getElementById('alert');
    const WARNING_SOUND = document.getElementById('warningSound');
    const THEME_SWITCHER_EL = document.getElementById('theme-switcher');
    const FOLLOW_BTN_EL = document.getElementById('follow-btn');
    const BODY_EL = document.body;

    // --- НАСТРОЙКИ ---
    const ALERT_DISTANCE_METERS = 500;
    const KYIV_CENTER_COORDS = [50.4501, 30.5234];
    const START_ZOOM = 11;
    const cameras = [
        { "id": 1, "address": "Київ, Вул. Олени Теліги, 37", "latitude": 50.47976284224108, "longitude": 30.452948986461525 },
        { "id": 2, "address": "Київ, Набережне шосе, 4", "latitude": 50.457901412011395, "longitude": 30.527442957220483 },
        { "id": 3, "address": "Київ, Чоколівський бульвар, 24", "latitude": 50.43113795599897, "longitude": 30.456036188787703 },
        { "id": 4, "address": "Київ, Вулиця Братиславська, 18", "latitude": 50.46762901306978, "longitude": 30.62556853358894 },
        { "id": 5, "address": "Київ, Дніпровська наб. / вул. Причальна", "latitude": 50.41735070661652, "longitude": 30.59349039947977 },
        { "id": 6, "address": "Київ, Міст Південний (у напрямку лівого берега)", "latitude": 50.395526733401255, "longitude": 30.57996719374169 },
        { "id": 7, "address": "Київ, Міст Південний (у напрямку правого берега)", "latitude": 50.39457937202338, "longitude": 30.59716777427918 },
        { "id": 8, "address": "Київ, Харківська площа (у напрямку м. Бориспіль)", "latitude": 50.401916303042086, "longitude": 30.687314716861728 },
        { "id": 9, "address": "Київ, Харківська площа (у напрямку просп. Бажана)", "latitude": 50.40276121181377, "longitude": 30.67950453945323 },
        { "id": 10, "address": "Київ, Проспект Володимира Івасюка, 25", "latitude": 50.50799929878177, "longitude": 30.507785142856324 },
        { "id": 11, "address": "Київ, Міст Північний (у напрямку лівого берега)", "latitude": 50.48998124385407, "longitude": 30.532946970222063},
        { "id": 12, "address": "Київ, Міст Північний (у напрямку правого берега)", "latitude": 50.492068883436254, "longitude": 30.53970691874305 },
        { "id": 13, "address": "Київ, Броварський пр. / вул. Будівельників", "latitude": 50.45521699415764, "longitude": 30.610008613114392 },
        { "id": 14, "address": "Київ, Проспект Червоної Калини, 56", "latitude": 50.52130928604588, "longitude": 30.619436488941094 },
        { "id": 15, "address": "Київ, Проспект Червоної Калини, 65", "latitude": 50.51403419994988, "longitude": 30.6152750577441 },
        { "id": 16, "address": "Київ, Бульвар Миколи Міхновського, 27", "latitude": 50.418985927273006, "longitude": 30.54558062287047 },
        { "id": 17, "address": "Київ, Бульвар Миколи Міхновського, 36", "latitude": 50.42005590704489, "longitude": 30.54868678029061 },
        { "id": 18, "address": "Київ, Столичне шосе, 58 (у напрямку м. Київ)", "latitude": 50.32824713749178, "longitude": 30.560742616995885 },
        { "id": 20, "address": "Київ, вул. Братиславська, 9г", "latitude": 50.47817936933572, "longitude": 30.617653817972354 },
        { "id": 21, "address": "Київ, просп. Голосіївський, 96 ", "latitude": 50.39029031444302, "longitude": 30.500675915383002 },
        { "id": 23, "address": "Київ, вул. Рональда Рейгана, 4", "latitude": 50.50169495065352, "longitude": 30.60389109997079 },
        { "id": 25, "address": "Київ, вул. Рональда Рейгана, 32", "latitude": 50.511510752099554, "longitude": 30.597903713211743},
        { "id": 26, "address": "Київ, вул. Наталії Ужвій, 1", "latitude": 50.50313524136293, "longitude": 30.44050748670203 },
        { "id": 27, "address": "Київ, просп. Правди, 58", "latitude": 50.50409785441508, "longitude": 30.43734111395448 },
        { "id": 28, "address": "Київ, вул. Ярослава Івашкевича, 5", "latitude": 50.505384034451076, "longitude": 30.455609479110443 },
        { "id": 29, "address": "Київ, вул. Автозаводська, 24/1", "latitude": 50.505133414180875, "longitude": 30.46027217502062 },
        { "id": 30, "address": "Київ, Броварський проспект (у напрямку м. Лівобережна)", "latitude": 50.46750986820274, "longitude": 30.6540704162387 },
        { "id": 31, "address": "Самуи, Чавенг. Резиденция", "latitude": 9.515984891145889, "longitude": 100.05453 }
    ];
    
    // --- ПЕРЕМЕННЫЕ СОСТОЯНИЯ ---
    let map, userMarker, routingControl;
    let lastAlertedCameraId = null, lastDistanceToNearest = Infinity, currentlyTrackedCameraId = null;
    let isInitialLocationSet = false;
    let isFollowing = true;

    // --- ИКОНКИ ---
    const cameraIcon = L.divIcon({ className: 'icon-wrapper', html: `<div class="camera-icon-display"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" /></svg></div>`, iconSize: [32, 32], iconAnchor: [16, 32] });
    const userIcon = L.divIcon({ className: 'icon-wrapper', html: `<div class="pulse-container"></div><div class="user-icon-rotator"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2L2 22l10-6 10 6z" /></svg></div>`, iconSize: [40, 40], iconAnchor: [20, 40] });

    // --- ФУНКЦИИ ---
    function initializeMap() {
        map = L.map('map', { zoomControl: false }).setView(KYIV_CENTER_COORDS, START_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19
        }).addTo(map);
        L.control.zoom({ position: 'bottomright' }).addTo(map);
        routingControl = L.Routing.control({
            position: 'topleft', waypoints: [ null, null ], routeWhileDragging: true, language: 'ru',
            createMarker: function() { return null; },
            geocoder: L.Control.Geocoder.nominatim(),
            geocoderPlaceholder: (i) => i === 0 ? 'Ваше місцезнаходження' : 'Введіть пункт призначення'
        }).addTo(map);
        map.on('dragstart', () => { if (isFollowing) { isFollowing = false; updateFollowButtonState(); } });
    }

    function getDistance(lat1, lon1, lat2, lon2) { const R = 6371e3; const φ1 = lat1 * Math.PI / 180, φ2 = lat2 * Math.PI / 180, Δφ = (lat2 - lat1) * Math.PI / 180, Δλ = (lon2 - lon1) * Math.PI / 180; const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2); return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); }
    function displayCamerasOnMap() { cameras.forEach(camera => { L.marker([camera.latitude, camera.longitude], { icon: cameraIcon }).addTo(map).bindPopup(`<b>${camera.address}</b>`); }); }
    function onLocationUpdate(position) { const { latitude, longitude, heading, speed } = position.coords; const userLatLng = L.latLng(latitude, longitude); if (speed !== null) { SPEED_VALUE_EL.textContent = Math.round(speed * 3.6); } else { SPEED_VALUE_EL.textContent = '--'; } if (!userMarker) { userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map); } else { userMarker.setLatLng(userLatLng); } if (heading !== null) { const markerEl = userMarker.getElement(); if (markerEl) { const rotator = markerEl.querySelector('.user-icon-rotator'); if (rotator) { rotator.style.transform = `rotate(${heading}deg)`; } } } if (isFollowing) { map.setView(userLatLng, map.getZoom()); } if (routingControl && !isInitialLocationSet) { routingControl.spliceWaypoints(0, 1, userLatLng); isInitialLocationSet = true; } let nearestCamera = null, minDistance = Infinity; cameras.forEach(camera => { const distance = getDistance(latitude, longitude, camera.latitude, camera.longitude); if (distance < minDistance) { minDistance = distance; nearestCamera = camera; } }); if (nearestCamera) { if (currentlyTrackedCameraId !== nearestCamera.id) { lastDistanceToNearest = Infinity; currentlyTrackedCameraId = nearestCamera.id; } const isInRange = minDistance <= ALERT_DISTANCE_METERS; const isApproaching = minDistance < lastDistanceToNearest; if (isInRange && isApproaching) { ALERT_EL.classList.remove('hidden'); if (lastAlertedCameraId !== nearestCamera.id) { WARNING_SOUND.play(); lastAlertedCameraId = nearestCamera.id; } } else { ALERT_EL.classList.add('hidden'); if (lastAlertedCameraId === nearestCamera.id) { lastAlertedCameraId = null; } } lastDistanceToNearest = minDistance; ADDRESS_EL.textContent = nearestCamera.address; DISTANCE_EL.textContent = `${Math.round(minDistance)} м`; } else { ADDRESS_EL.textContent = "-"; DISTANCE_EL.textContent = "-"; ALERT_EL.classList.add('hidden'); lastDistanceToNearest = Infinity; currentlyTrackedCameraId = null; lastAlertedCameraId = null; } }
    function onLocationError(error) { alert(`Помилка геолокації: ${error.message}`); }
    
    // --- УПРАВЛЕНИЕ КНОПКАМИ ---
    function updateFollowButtonState() { if (isFollowing) { FOLLOW_BTN_EL.classList.add('active'); FOLLOW_BTN_EL.title = 'Отключить следование'; } else { FOLLOW_BTN_EL.classList.remove('active'); FOLLOW_BTN_EL.title = 'Следовать за мной'; } }
    FOLLOW_BTN_EL.addEventListener('click', () => { isFollowing = !isFollowing; if (isFollowing && userMarker) { map.setView(userMarker.getLatLng(), 15); } updateFollowButtonState(); });
    function setTheme(theme) { if (theme === 'dark') { BODY_EL.classList.add('dark-theme'); THEME_SWITCHER_EL.textContent = '☀️'; localStorage.setItem('theme', 'dark'); } else { BODY_EL.classList.remove('dark-theme'); THEME_SWITCHER_EL.textContent = '🌙'; localStorage.setItem('theme', 'light'); } }
    THEME_SWITCHER_EL.addEventListener('click', () => { const isDark = BODY_EL.classList.contains('dark-theme'); setTheme(isDark ? 'light' : 'dark'); });
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    // --- PWA: РЕГИСТРАЦИЯ SERVICE WORKER И WAKE LOCK ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js').then(reg => console.log('Service worker registered.', reg)).catch(err => console.log('Service worker registration failed: ', err));
        });
    }

    let wakeLock = null;
    const requestWakeLock = async () => {
        if ('wakeLock' in navigator) {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake Lock is active!');
                wakeLock.addEventListener('release', () => console.log('Wake Lock was released.'));
            } catch (err) { console.error(`${err.name}, ${err.message}`); }
        }
    };
    
    // Активируем Wake Lock при первом клике/касании, чтобы не вызывать ошибку
    document.addEventListener('click', requestWakeLock, { once: true });


    // --- ЗАПУСК ПРИЛОЖЕНИЯ ---
    updateFollowButtonState();
    initializeMap();
    displayCamerasOnMap();
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(onLocationUpdate, onLocationError, { enableHighAccuracy: true });
    } else {
        alert('Геолокація не підтримується вашим браузером.');
    }
});
