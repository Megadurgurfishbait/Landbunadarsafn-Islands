"use strict";var precacheConfig=[["/index.html","52dec8b8046f15637e61a3c8e2e244a0"],["/static/js/main.b44d4eac.js","7f183e635b864c0532c4ec70a5ee7eaa"],["/static/media/Arsskyrsla 2012.1566ca18.pdf","1566ca185cc21b5d4c233d593d99cf21"],["/static/media/Engjar.2c933145.pdf","2c9331450b921320ceb600244042bb05"],["/static/media/arsskyrsla2011.8e971163.pdf","8e9711630a222874713ad88cc5a52a12"],["/static/media/arsskyrsla2014.3f13590c.pdf","3f13590c9957ab65953d49ad86fa7873"],["/static/media/arsskyrsla2015.c09c8894.pdf","c09c88945060ccca2b87500f9483b80a"],["/static/media/arsskyrsla2016.4efdef7d.pdf","4efdef7dfdc98ca419f07b8124d12c7a"],["/static/media/fergusonminningar.501b4322.pdf","501b4322648ee895c57f622dcd83a3c6"],["/static/media/gomlustadarhusin.ff2719bd.pdf","ff2719bdcf323a9a328aa2bb2a179205"],["/static/media/gridur_jondyri.2b6120bb.pdf","2b6120bb829a7971cb4b16414c7299b3"],["/static/media/heyturn.e527e691.pdf","e527e6914e777803567db2a79146426b"],["/static/media/home.16e7ba86.jpg","16e7ba8697cc7be999a778de08c30eac"],["/static/media/islenskir_jardraektarhaettir.7afc0f9d.pdf","7afc0f9d68ee9003dc612ebe5b761ab7"],["/static/media/raektunarminnjar.66d8015d.pdf","66d8015d34b774501d94183e02b1a124"],["/static/media/sogukaflar um svansa.7ac9336c.pdf","7ac9336c5ec785aa232c4798eb29fff3"],["/static/media/sprites.4655318d.svg","4655318df32cd5be10092eaf10a52484"],["/static/media/sprites.abb04f25.svg","abb04f25f60f6bc57013e8e587ea04c9"],["/static/media/torfi_og_olafsdalsskolinn.0c3d6f5b.pdf","0c3d6f5b33f68e71a5da8e00674aa256"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,a){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=a),t.toString()},cleanResponse=function(a){return a.redirected?("body"in a?Promise.resolve(a.body):a.blob()).then(function(e){return new Response(e,{headers:a.headers,status:a.status,statusText:a.statusText})}):Promise.resolve(a)},createCacheKey=function(e,a,t,r){var n=new URL(e);return r&&n.pathname.match(r)||(n.search+=(n.search?"&":"")+encodeURIComponent(a)+"="+encodeURIComponent(t)),n.toString()},isPathWhitelisted=function(e,a){if(0===e.length)return!0;var t=new URL(a).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,t){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(a){return t.every(function(e){return!e.test(a[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var a=e[0],t=e[1],r=new URL(a,self.location),n=createCacheKey(r,hashParamName,t,/\.\w{8}\./);return[r.toString(),n]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(r){return setOfCachedUrls(r).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!t.has(a)){var e=new Request(a,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+a+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return r.put(a,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(a){return a.keys().then(function(e){return Promise.all(e.map(function(e){if(!t.has(e.url))return a.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(a){if("GET"===a.request.method){var e,t=stripIgnoredUrlParameters(a.request.url,ignoreUrlParametersMatching),r="index.html";(e=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,r),e=urlsToCacheKeys.has(t));var n="/index.html";!e&&"navigate"===a.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],a.request.url)&&(t=new URL(n,self.location).toString(),e=urlsToCacheKeys.has(t)),e&&a.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',a.request.url,e),fetch(a.request)}))}});