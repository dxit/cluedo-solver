export const appLocales = ["en", "it", "de"] as const;

export type AppLocale = (typeof appLocales)[number];

export const defaultLocale: AppLocale = "en";
export const localeStorageKey = "cluedo-solver.locale";

export function isAppLocale(value: string): value is AppLocale {
	return appLocales.includes(value as AppLocale);
}

export function normalizeLocale(input: string | null | undefined): AppLocale {
	if (!input) {
		return defaultLocale;
	}

	const normalized = input.toLocaleLowerCase();

	if (normalized.startsWith("it")) {
		return "it";
	}

	if (normalized.startsWith("de")) {
		return "de";
	}

	return "en";
}

export function extractLocaleFromPathname(
	pathname: string,
): AppLocale | undefined {
	const segment = pathname.split("/").filter(Boolean)[0];

	if (segment && isAppLocale(segment)) {
		return segment;
	}

	return undefined;
}

export function stripLocaleFromPathname(pathname: string) {
	const locale = extractLocaleFromPathname(pathname);

	if (!locale) {
		return pathname === "" ? "/" : pathname;
	}

	const nextPathname = pathname.slice(`/${locale}`.length);
	return nextPathname.length > 0 ? nextPathname : "/";
}

export function buildLocalizedPath(pathname: string, locale: AppLocale) {
	const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const pathWithoutLocale = stripLocaleFromPathname(normalizedPath);

	if (pathWithoutLocale === "/") {
		return `/${locale}`;
	}

	return `/${locale}${pathWithoutLocale}`;
}

export function getPreferredLocale() {
	if (typeof window === "undefined") {
		return defaultLocale;
	}

	const storedLocale = window.localStorage.getItem(localeStorageKey);

	if (storedLocale && isAppLocale(storedLocale)) {
		return storedLocale;
	}

	const navigatorLocale = window.navigator.languages[0] ?? window.navigator.language;
	return normalizeLocale(navigatorLocale);
}

export function persistPreferredLocale(locale: AppLocale) {
	if (typeof window === "undefined") {
		return;
	}

	window.localStorage.setItem(localeStorageKey, locale);
}
