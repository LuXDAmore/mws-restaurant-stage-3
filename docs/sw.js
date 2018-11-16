/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.6.3/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.6.3"});

importScripts(
  "sw-toolbox.js"
);

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "19f0a6f4a75871e506f5d70271227aee"
  },
  {
    "url": "app/scripts/app-20c1a63086.min.js",
    "revision": "20c1a630860310aea61ba54e91c10965"
  },
  {
    "url": "app/scripts/vendor-e8d3bd6056.min.js",
    "revision": "e8d3bd60565c08fddb9c40ac6139c273"
  },
  {
    "url": "app/styles/app-c6808e1ae0.min.css",
    "revision": "c6808e1ae07813835ba81e25894fb4c7"
  },
  {
    "url": "app/styles/vendor-53ea5782f5.min.css",
    "revision": "53ea5782f59ed973ef2d3d510a2ba717"
  },
  {
    "url": "data/restaurants.json",
    "revision": "2b36e4b306a038bf68891da634d5060a"
  },
  {
    "url": "index.html",
    "revision": "508f7896414e30386d8fdf25756402f9"
  },
  {
    "url": "manifest.json",
    "revision": "af633056a382ff7524b949789229fa4f"
  },
  {
    "url": "restaurant.html",
    "revision": "9196c93389af30a333e8d76a30ac46e2"
  },
  {
    "url": "sw-toolbox.js",
    "revision": "b856cdefb7ff3e938f8598c16a60285e"
  },
  {
    "url": "assets/icons/icon-128x128.png",
    "revision": "5d71ddc191518a885c5a86b705f59d67"
  },
  {
    "url": "assets/icons/icon-144x144.png",
    "revision": "11369ed731eed6b7b1e5d0a5875a7a04"
  },
  {
    "url": "assets/icons/icon-152x152.png",
    "revision": "a5a16a926ecbf2563659dd84fb074512"
  },
  {
    "url": "assets/icons/icon-192x192.png",
    "revision": "9c83dac4dc937b1bc3e668b2581e65a6"
  },
  {
    "url": "assets/icons/icon-384x384.png",
    "revision": "d2e3e063ba7c6b37abd3aad4c74cf558"
  },
  {
    "url": "assets/icons/icon-512x512.png",
    "revision": "5d71ddc191518a885c5a86b705f59d67"
  },
  {
    "url": "assets/icons/icon-72x72.png",
    "revision": "ca85ebe8da48609b74b8ae75a3f76c29"
  },
  {
    "url": "assets/icons/icon-96x96.png",
    "revision": "c5ad8187f6d8717359265c3dd020ec80"
  },
  {
    "url": "assets/icons/safari-pinned-tab.svg",
    "revision": "3147609d4c3df2fb51f2b75f21af67ef"
  },
  {
    "url": "assets/images/400/1.jpg",
    "revision": "428bfe3a339bbfa77646eae0140d57ec"
  },
  {
    "url": "assets/images/400/1.webp",
    "revision": "68ae8d210cb00521f1a71459cdbba442"
  },
  {
    "url": "assets/images/400/10.jpg",
    "revision": "9a95e31ce3cb78d93e43462c0121e040"
  },
  {
    "url": "assets/images/400/10.webp",
    "revision": "33faf8e8f0700adfd7c415a1df6d5baf"
  },
  {
    "url": "assets/images/400/2.jpg",
    "revision": "3cdbece6b16e10d6a03b020b5f07629b"
  },
  {
    "url": "assets/images/400/2.webp",
    "revision": "e56fbfef5d03712b37f5f0bf282d341e"
  },
  {
    "url": "assets/images/400/3.jpg",
    "revision": "1bb5700d370f1c096f19be65e16e6189"
  },
  {
    "url": "assets/images/400/3.webp",
    "revision": "508c4fb96c9be0fe413eb26b13669243"
  },
  {
    "url": "assets/images/400/4.jpg",
    "revision": "219f124dc942aa70ee0f6611d0c5f262"
  },
  {
    "url": "assets/images/400/4.webp",
    "revision": "cd6dfc732f82c09e90ae4b5589734d72"
  },
  {
    "url": "assets/images/400/5.jpg",
    "revision": "b5ab8c658c0512da10bbe0451bf60fb1"
  },
  {
    "url": "assets/images/400/5.webp",
    "revision": "f5d7144cc9f030fc77fd8f60bb8cccef"
  },
  {
    "url": "assets/images/400/6.jpg",
    "revision": "c1ca7d7af32a99eee82a752c90bfbe02"
  },
  {
    "url": "assets/images/400/6.webp",
    "revision": "0ae2f6ce33e7f2b588a089e8d04012f2"
  },
  {
    "url": "assets/images/400/7.jpg",
    "revision": "9b66fd73294b5b20cbf0525edc918eb6"
  },
  {
    "url": "assets/images/400/7.webp",
    "revision": "15d3983914f9eea7a01887c3111e6d3d"
  },
  {
    "url": "assets/images/400/8.jpg",
    "revision": "dccf3ae225bb2773a3d029372bea63dd"
  },
  {
    "url": "assets/images/400/8.webp",
    "revision": "bb2e4d893106214631ce3828b09da053"
  },
  {
    "url": "assets/images/400/9.jpg",
    "revision": "e576446bb27cce9e4a50a28312013079"
  },
  {
    "url": "assets/images/400/9.webp",
    "revision": "425b10844d0f45770684d7b1d3f2bd68"
  },
  {
    "url": "assets/images/480/1.jpg",
    "revision": "9440ec4d1d566c438b55faf8a6180ed6"
  },
  {
    "url": "assets/images/480/1.webp",
    "revision": "5f3332e299d6c1642cc74ccff63e65e0"
  },
  {
    "url": "assets/images/480/10.jpg",
    "revision": "391119593f63de8cdcbacb1a9bdaeaad"
  },
  {
    "url": "assets/images/480/10.webp",
    "revision": "1956313389018a5a35ff867f5665cbe4"
  },
  {
    "url": "assets/images/480/2.jpg",
    "revision": "fe630541e0a85f1af065c8635be32f09"
  },
  {
    "url": "assets/images/480/2.webp",
    "revision": "e680a76d2e8ef422e866690b29b1d7bf"
  },
  {
    "url": "assets/images/480/3.jpg",
    "revision": "4c0162d43279ed24a391709c1bfe4b72"
  },
  {
    "url": "assets/images/480/3.webp",
    "revision": "3faeae15de8c5dc026ddf5bca5026746"
  },
  {
    "url": "assets/images/480/4.jpg",
    "revision": "524aaaaea9f9027afb66e534e962c8fb"
  },
  {
    "url": "assets/images/480/4.webp",
    "revision": "1861794d68705e40a40c07f820640ea3"
  },
  {
    "url": "assets/images/480/5.jpg",
    "revision": "1cdade1ac6bb66701f3285aa45e4005d"
  },
  {
    "url": "assets/images/480/5.webp",
    "revision": "f1e967e167c2258f4865c814efd38fad"
  },
  {
    "url": "assets/images/480/6.jpg",
    "revision": "1d9285d5c72f016b4180b1c3d902507a"
  },
  {
    "url": "assets/images/480/6.webp",
    "revision": "9dc436acae67d9741d3795d5814c7659"
  },
  {
    "url": "assets/images/480/7.jpg",
    "revision": "c67e72ff3a28a7b44a750e70d9d349f7"
  },
  {
    "url": "assets/images/480/7.webp",
    "revision": "b2132f477a9c633c0d4cabdc74d8c858"
  },
  {
    "url": "assets/images/480/8.jpg",
    "revision": "443aa980bbe241471ed4c364dcf13273"
  },
  {
    "url": "assets/images/480/8.webp",
    "revision": "c2eb2522fa730a16a7713e03a22e59a5"
  },
  {
    "url": "assets/images/480/9.jpg",
    "revision": "627d9d57b68effcb5a2fe00cb29d88bc"
  },
  {
    "url": "assets/images/480/9.webp",
    "revision": "9a9a0df29ad1e558173963625bb435c4"
  },
  {
    "url": "assets/images/640/1.jpg",
    "revision": "4765bc688e0f5e0fc03a26efc169f9cb"
  },
  {
    "url": "assets/images/640/1.webp",
    "revision": "d8f726420a77113bc558a76c09bab050"
  },
  {
    "url": "assets/images/640/10.jpg",
    "revision": "d361b0f270ca263668d7053ec6aa9cac"
  },
  {
    "url": "assets/images/640/10.webp",
    "revision": "952932beb71a510b089a69ce7f0db850"
  },
  {
    "url": "assets/images/640/2.jpg",
    "revision": "6d6ce548fdb3a28d8bdae8606c7bb517"
  },
  {
    "url": "assets/images/640/2.webp",
    "revision": "68ad031f95c7de3ac5d67bcb68217232"
  },
  {
    "url": "assets/images/640/3.jpg",
    "revision": "f9c0520a5d4105050a6a6a60c52744ee"
  },
  {
    "url": "assets/images/640/3.webp",
    "revision": "eb63ec5ffd562a06b59ec7559b6b254f"
  },
  {
    "url": "assets/images/640/4.jpg",
    "revision": "6233d09b07ed44e07f7463d313399f11"
  },
  {
    "url": "assets/images/640/4.webp",
    "revision": "3b0e0b13b05649fc73ec2de75f3716cd"
  },
  {
    "url": "assets/images/640/5.jpg",
    "revision": "b3b203b802bec8f8507945f1cf434e19"
  },
  {
    "url": "assets/images/640/5.webp",
    "revision": "0fdd0c4a08c10d91d033422e305e6a3c"
  },
  {
    "url": "assets/images/640/6.jpg",
    "revision": "f25d995b057c5f7cea7100ae9fc6fc78"
  },
  {
    "url": "assets/images/640/6.webp",
    "revision": "74b57593a19e55c37c1abd5208554fe9"
  },
  {
    "url": "assets/images/640/7.jpg",
    "revision": "80789f8f616e59469527a460dbfdd8b2"
  },
  {
    "url": "assets/images/640/7.webp",
    "revision": "7427d2b68126e149df81ac8a3a1056a1"
  },
  {
    "url": "assets/images/640/8.jpg",
    "revision": "41266a686c68a38ef0a7fd9ae5f1cffd"
  },
  {
    "url": "assets/images/640/8.webp",
    "revision": "dd2e18fb37d93cce33e2b546f7919067"
  },
  {
    "url": "assets/images/640/9.jpg",
    "revision": "fc3e6dd7b05201303dbc0bed703b6952"
  },
  {
    "url": "assets/images/640/9.webp",
    "revision": "67f5c462f0b5582f7fe8248300a22792"
  },
  {
    "url": "assets/images/800/1.jpg",
    "revision": "5c70805661d07a8a480654a4a0272621"
  },
  {
    "url": "assets/images/800/1.webp",
    "revision": "fd8759877013b4bcb9761875915ea1a7"
  },
  {
    "url": "assets/images/800/10.jpg",
    "revision": "0524e9f42c387f7496a3c3558c69a688"
  },
  {
    "url": "assets/images/800/10.webp",
    "revision": "370c8d7024189e4dfc66036e8aaece03"
  },
  {
    "url": "assets/images/800/2.jpg",
    "revision": "280ddab2bed6d29b5a459057fa5cc097"
  },
  {
    "url": "assets/images/800/2.webp",
    "revision": "ed15e50ec375a7edec16e5a783922abe"
  },
  {
    "url": "assets/images/800/3.jpg",
    "revision": "626c3982cfe4afea3b0999b1b070e7af"
  },
  {
    "url": "assets/images/800/3.webp",
    "revision": "c08ecea30ed4292d208ce48925caab84"
  },
  {
    "url": "assets/images/800/4.jpg",
    "revision": "629b7af49c58d4a2393108332e347dbf"
  },
  {
    "url": "assets/images/800/4.webp",
    "revision": "a6f90512d07c0d5e9caf7b147b8fd366"
  },
  {
    "url": "assets/images/800/5.jpg",
    "revision": "d45352c97bd1504220924cfbee9fdcc0"
  },
  {
    "url": "assets/images/800/5.webp",
    "revision": "cb46d73bbbcdf036623f9176f9dbcfe0"
  },
  {
    "url": "assets/images/800/6.jpg",
    "revision": "ffff77e168b9d931da55b836d0da21fd"
  },
  {
    "url": "assets/images/800/6.webp",
    "revision": "47d66590f489ef34861ab2814fb85492"
  },
  {
    "url": "assets/images/800/7.jpg",
    "revision": "27083fb5d734ad3febd3158980d68145"
  },
  {
    "url": "assets/images/800/7.webp",
    "revision": "d3ba8862c6e27a34d7dab11536cce244"
  },
  {
    "url": "assets/images/800/8.jpg",
    "revision": "19d78a5af9d0986636b4b6355d793a7f"
  },
  {
    "url": "assets/images/800/8.webp",
    "revision": "5e5f18b0749b9cd197223e54c9f46701"
  },
  {
    "url": "assets/images/800/9.jpg",
    "revision": "ec2d5176a0ca85e31e26c19e9565a08c"
  },
  {
    "url": "assets/images/800/9.webp",
    "revision": "b13289171b7dc4d8a5cad8f1bfca0c05"
  },
  {
    "url": "assets/images/placeholder/map-home.webp",
    "revision": "b5067ed11b42ee307334362e0187ee87"
  },
  {
    "url": "assets/images/placeholder/map-marker.webp",
    "revision": "c126195254c80c927bb7fb352e521e0e"
  },
  {
    "url": "favicon.ico",
    "revision": "bdcd3c94865056ed3b0a0c5a8d97e870"
  },
  {
    "url": "favicon.png",
    "revision": "c2d2e8555efc218d60b704b47a3d6a1d"
  },
  {
    "url": "/mws-restaurant-stage-3/",
    "revision": "740e20504836b1c34aa0bdc9e1305110"
  },
  {
    "url": "restaurant.html?id",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=1",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=2",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=3",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=4",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=5",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=6",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=7",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=8",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=9",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  },
  {
    "url": "restaurant.html?id=10",
    "revision": "bc04efa854bf6dd08fde78def75c6d2e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/.*\.css$/, workbox.strategies.cacheFirst({ "cacheName":"styles-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":10,"maxAgeSeconds":31536000,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/.*\.(?:webp|png|jpg|jpeg|svg|ico|cur|bmp)$/, workbox.strategies.cacheFirst({ "cacheName":"images-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":60,"maxAgeSeconds":604800,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/restaurant\.html.*$/, workbox.strategies.networkFirst({ "cacheName":"restaurant-pages", plugins: [new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/.*\/restaurants[\/]?$/, workbox.strategies.networkFirst({ "cacheName":"restaurants-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":10,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/.*\/restaurants\/[1,9]$/, workbox.strategies.networkFirst({ "cacheName":"restaurant-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":10,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/.*\/reviews\/\?restaurant_id=[1,9]$/, workbox.strategies.networkFirst({ "cacheName":"reviews-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":20,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/(.*)\.(?:googleapis|gstatic)\.com\/(.*)/, workbox.strategies.staleWhileRevalidate({ "cacheName":"googleapis-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":30,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
workbox.routing.registerRoute(/.*\.json$/, workbox.strategies.cacheFirst({ "cacheName":"json-cache", plugins: [new workbox.expiration.Plugin({"maxEntries":10,"purgeOnQuotaError":false}), new workbox.cacheableResponse.Plugin({"statuses":[0,200]})] }), 'GET');
