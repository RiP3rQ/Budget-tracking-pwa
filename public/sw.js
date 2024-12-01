self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Check if the request URL includes either "clerk.accounts.dev" or "img.clerk.com"
  if (
    url.hostname.includes("clerk.accounts.dev") ||
    url.hostname.includes("img.clerk.com")
  ) {
    console.log(
      "Skipping service worker for Clerk.js or Clerk image request:",
      event.request.url,
    );
    return; // Let the browser handle these requests directly
  }

  event.respondWith(fetch(event.request));
});

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
