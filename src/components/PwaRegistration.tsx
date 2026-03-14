import { useEffect } from "react";

export default function PwaRegistration() {
	useEffect(() => {
		if (!import.meta.env.PROD || typeof window === "undefined") {
			return;
		}

		if (!("serviceWorker" in navigator)) {
			return;
		}

		const registerServiceWorker = async () => {
			try {
				await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});
			} catch (error) {
				if (import.meta.env.DEV) {
					console.error("Service worker registration failed.", error);
				}
			}
		};

		void registerServiceWorker();
	}, []);

	return null;
}
