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
    console.log(`Workbox loaded.`);

    // Debugging Workbox
    // Force production builds
    workbox.setConfig({ debug: false });

    // cache-first handler.
    workbox.precaching.precacheAndRoute([]);

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
