const STATIC_CACHE = "cluedo-solver-static-v1";
const PAGE_CACHE = "cluedo-solver-pages-v1";

const PRECACHE_URLS = [
	"/",
	"/new-game",
	"/en/new-game",
	"/it/new-game",
	"/de/new-game",
	"/offline.html",
	"/manifest.json",
	"/favicon.ico",
	"/favicon.svg",
	"/favicon-16x16.png",
	"/favicon-32x32.png",
	"/apple-touch-icon.png",
	"/android-chrome-192x192.png",
	"/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(STATIC_CACHE)
			.then((cache) => cache.addAll(PRECACHE_URLS))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter(
							(cacheName) =>
								cacheName !== STATIC_CACHE && cacheName !== PAGE_CACHE,
						)
						.map((cacheName) => caches.delete(cacheName)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

self.addEventListener("fetch", (event) => {
	const { request } = event;

	if (request.method !== "GET") {
		return;
	}

	const url = new URL(request.url);

	if (url.origin !== self.location.origin) {
		return;
	}

	if (request.mode === "navigate") {
		event.respondWith(handleNavigationRequest(request));
		return;
	}

	if (isStaticAssetRequest(request, url)) {
		event.respondWith(handleStaticAssetRequest(request));
	}
});

function isStaticAssetRequest(request, url) {
	return (
		request.destination === "style" ||
		request.destination === "script" ||
		request.destination === "font" ||
		request.destination === "image" ||
		url.pathname.startsWith("/assets/") ||
		url.pathname === "/manifest.json" ||
		url.pathname === "/favicon.ico" ||
		url.pathname === "/favicon.svg" ||
		url.pathname.endsWith(".png") ||
		url.pathname.endsWith(".ico")
	);
}

async function handleNavigationRequest(request) {
	const cache = await caches.open(PAGE_CACHE);

	try {
		const response = await fetch(request);

		if (isCacheableHtmlResponse(response)) {
			await cache.put(request, response.clone());
		}

		return response;
	} catch {
		const cachedResponse = await cache.match(request);

		if (cachedResponse) {
			return cachedResponse;
		}

		return (
			(await caches.match("/offline.html")) ||
			new Response("Offline", {
				status: 503,
				statusText: "Offline",
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
				},
			})
		);
	}
}

async function handleStaticAssetRequest(request) {
	const cache = await caches.open(STATIC_CACHE);
	const cachedResponse = await cache.match(request);

	if (cachedResponse) {
		void updateStaticAsset(cache, request);
		return cachedResponse;
	}

	const networkResponse = await updateStaticAsset(cache, request);

	if (networkResponse) {
		return networkResponse;
	}

	return new Response("", {
		status: 504,
		statusText: "Gateway Timeout",
	});
}

async function updateStaticAsset(cache, request) {
	try {
		const response = await fetch(request);

		if (response.ok) {
			await cache.put(request, response.clone());
		}

		return response;
	} catch {
		return null;
	}
}

function isCacheableHtmlResponse(response) {
	return (
		response.ok &&
		(response.headers.get("Content-Type") || "").includes("text/html")
	);
}
