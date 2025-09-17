// This service worker is designed to unregister itself and remove any previous versions from clients.
// This is a "suicide" worker to fix network proxy issues in the production environment.

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
  console.log('New service worker installing, preparing to unregister.');
});

self.addEventListener('activate', (event) => {
  console.log('New service worker activated, now unregistering...');
  // Unregister the service worker.
  event.waitUntil(
    self.registration.unregister()
      .then(() => {
        // Once unregistered, reload all clients to ensure they are no longer controlled by a service worker.
        return self.clients.matchAll();
      })
      .then((clients) => {
        clients.forEach((client) => client.navigate(client.url));
        console.log('Service worker unregistered and clients reloaded.');
      })
  );
});
