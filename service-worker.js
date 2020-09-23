const FILES_TO_CACHE = [
    "./index.html",
    "./events.html",
    "./tickets.html",
    "./schedule.html",
    "./assets/css/style.css",
    "./assets/css/bootstrap.css",
    "./assets/css/tickets.css",
    "./dist/app.bundle.js",
    "./dist/main.bundle.js",
    "./dist/events.bundle.js",
    "./dist/tickets.bundle.js",
    "./dist/schedule.bundle.js"
];
const APP_PREFIX = 'FoodFest-';     
const VERSION = 'version_03';
const CACHE_NAME = APP_PREFIX + VERSION;

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log(`installing cache : ${CACHE_NAME}`)
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys()
        .then(function (keyList) {
            let cacheKeeplist = keyList.filter( key => key.indexOf(APP_PREFIX))
            cacheKeeplist.push(CACHE_NAME)
            return Promise.all(keyList.map(function (key,i) {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log(`deleting cache : ${keyList[i]}`)
                    return caches.delete(keyList[i]);
                }
            }))
        })
        .catch(err => console.log(err))
    )
})

self.addEventListener('fetch', e => {
    const url = e.request.url
    console.log(`fetch request : ${url}`)
    e.respondWith(
        caches.match(e.request)
        .then( request => {
            request
            ? console.log(`responding with cache : ${url}`)
            : console.log(`file not cached, fetching : ${url}`)
            return request || fetch(e.request)
        })
        .catch(err => console.log(err))
    )
})