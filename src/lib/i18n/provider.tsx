import { createInstance } from "i18next";
import {
	I18nextProvider,
	initReactI18next,
	useTranslation,
} from "react-i18next";
import { useMemo, type PropsWithChildren } from "react";
import { useRouterState } from "@tanstack/react-router";
import { defaultLocale, extractLocaleFromPathname } from "./locales";
import { resources } from "./resources";

import type { AppLocale } from "./locales";

function createI18nInstance(locale: AppLocale) {
	const instance = createInstance();

	void instance.use(initReactI18next).init({
		resources,
		lng: locale,
		fallbackLng: defaultLocale,
		supportedLngs: Object.keys(resources),
		defaultNS: "translation",
		ns: ["translation"],
		react: {
			useSuspense: false,
		},
		interpolation: {
			escapeValue: false,
		},
		initImmediate: false,
	});

	return instance;
}

export function useActiveLocale() {
	return useRouterState({
		select: (state) =>
			extractLocaleFromPathname(state.location.pathname) ?? defaultLocale,
	});
}

export function AppI18nProvider({ children }: PropsWithChildren) {
	const locale = useActiveLocale();
	const i18n = useMemo(() => createI18nInstance(locale), [locale]);

	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export { useTranslation };
