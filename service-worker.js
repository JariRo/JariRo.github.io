importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.0.0/workbox-sw.js"
);

if (workbox) {
  console.log("yay workbox is loaded");
} else {
  console.log("neeei workbox did not load");
}

workbox.precaching.precacheAndRoute([
  "/stylesheets/main.css",
  "js/main.js",
  "index.html",
  "2DO_logo.png",
]);

workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());

workbox.routing.registerRoute(
  /\.css$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "cache-v1",
  })
);

const staticCacheName = "cache-v1";
const precacheResources = [
  "/",
  "stylesheets/main.css",
  "js/main.js",
  "index.html",
];
