const CACHE_NAME="mybudget_cache"
const CACHE_VERSION="1"

const addResourcesToCache=async (resources)=>{
const cache=await caches.open(`${CACHE_NAME}-v${CACHE_VERSION}`)
await cache.addAll(resources)
}

self.addEventListener("install", (event)=>{
event.waitUntil(
    addResourcesToCache([
        "/",
        "/index.html",
        "/styles.css",
        "/transition.css",

        "/script.js",
        "/scripts/variables.js",
        "/scripts/components.js",
        "/scripts/transitions.js",
        "/scripts/utils.js",
    ]),
)
})

const putInCache=async (request, response)=>{
const cache=await caches.open(`${CACHE_NAME}-v${CACHE_VERSION}`)
await cache.put(request, response)
}

const cacheFirst=async (request)=>{
const responseFromCache=await caches.match(request)
if (responseFromCache) {
    return responseFromCache
}
const responseFromNetwork=await fetch(request)
putInCache(request, responseFromNetwork.clone())
return responseFromNetwork
}

self.addEventListener("fetch", (event)=>{
event.respondWith(cacheFirst(event.request))
})
  