importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js');

/**
 * Workbox 3.1.0
 * Workbox - https://developers.google.com/web/tools/workbox/
 * Codelab - https://codelabs.developers.google.com/codelabs/workbox-lab/
 *
 * Workbox creates a configuration file (in this case workbox-config.js) that
 * workbox-cli uses to generate service workers.

 * The importScripts call imports the workbox-sw.js library so the workbox
 * object gives our service worker access to all the Workbox modules.
 */

if (workbox) {
    console.log(`Workbox loaded. swj`);

    // Debugging Workbox
    // Force production builds
    workbox.setConfig({ debug: false });

    // cache-first handler.
    workbox.precaching.precacheAndRoute([
        {
            "url": [
                    "./data/restaurants.json",
                    "./js/dbhelper.js",
                    "./js/main.js",
                    "./js/sw-src.js",
                    "./js/workbox-config.js",
                    "./js/mapBox/mapBox.js",
                    "./mapBox/mapBox.css",
                    "./img/1.jpg",
                    "./img/2.jpg",
                    "./img/3.jpg",
                    "./img/4.jpg",
                    "./img/5.jpg",
                    "./img/6.jpg",
                    "./img/7.jpg",
                    "./img/8.jpg",
                    "./img/9.jpg",
                    "./img/10.jpg",
                    "./img/favicon.png",
                    "./img/marker.svg",
                    "./css/fonts/Quicksand-Regular.ttf",
                    "./css/fonts/Muli-Regular.ttf",
                    "./css/fonts/Raleway-Regular.ttf",
                    "./css/styles.css",
                    "./index.html",
                    "./restaurant.html"
            ],
            "revision": "ef524a681d8e0c52cdd55e6c0bb53ec3"
        }
    ]);

    // Google APIs
    workbox.routing.registerRoute(
        new RegExp('(.*).(?:googleapis|gstatic).com/(.*)'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'cache-googleapis',
            cacheExpiration: {
                maxEntries: 20
            },
            cacheableResponse: {statuses: [0, 200]}
        })
    );

    // Images
    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        // Whenever the app requests images, the service worker checks the
        // cache first for the resource before going to the network.
        workbox.strategies.cacheFirst({
            cacheName: 'cache-images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                })
            ]
        })
    );

    // RestaurantsDetails
    workbox.routing.registerRoute(
        new RegExp('restaurant.html(.*)'),
        workbox.strategies.networkFirst({
            cacheName: 'cache-restaurants',
            cacheableResponse: {statuses: [0, 200]}
        })
    );

} else {
    console.log(`Workbox failed to load.`);
}
