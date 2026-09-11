const CACHE='city-in-a-tab-v1.5.2';
const CORE = [
  './','./index.html','./manifest.json','./css/styles.css','./assets/build-icons/house.svg',
  './assets/build-icons/apartments.svg',
  './assets/build-icons/tower.svg',
  './assets/build-icons/shops.svg',
  './assets/build-icons/mall.svg',
  './assets/build-icons/office.svg',
  './assets/build-icons/workshop.svg',
  './assets/build-icons/factory.svg',
  './assets/build-icons/advanced.svg',
  './assets/build-icons/park.svg',
  './assets/build-icons/garden.svg',
  './assets/build-icons/clinic.svg',
  './assets/build-icons/police.svg',
  './assets/build-icons/library.svg',
  './assets/build-icons/road.svg','./assets/build-icons/school.svg','./assets/build-icons/recycling.svg','./assets/build-icons/cinema.svg','./assets/build-icons/firestation.svg','./assets/build-icons/transitHub.svg','./assets/build-icons/hotel.svg','./assets/ui-icons/clock.svg','./icons/icon.svg',
  './data/buildings.js','./data/events.js','./data/decisions.js','./data/traits.js','./data/achievements.js','./data/projects.js',
  './js/state.js','./js/i18n.js','./js/storage.js','./js/simulation.js','./js/sprites.js','./js/map.js','./js/ui.js','./js/main.js'
];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => {
    const copy=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return res;
  }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html'))));
});
