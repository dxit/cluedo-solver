import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useEffect } from "react";

import NotFoundPage from "#/components/NotFoundPage";
import {
	defaultLocale,
	isAppLocale,
	persistPreferredLocale,
} from "#/lib/i18n/locales";

export const Route = createFileRoute("/$locale")({
	beforeLoad: ({ location, params }) => {
		if (isAppLocale(params.locale)) {
			return;
		}

		const pathSegments = location.pathname.split("/").filter(Boolean);
		const localizedPath = `/${[defaultLocale, ...pathSegments.slice(1)].join("/")}`;

		throw redirect({
			href: `${localizedPath}${location.searchStr}${location.hash}`,
			replace: true,
		});
	},
	component: LocaleLayout,
	notFoundComponent: NotFoundPage,
});

function LocaleLayout() {
	const { locale } = Route.useParams();

	useEffect(() => {
		if (isAppLocale(locale)) {
			persistPreferredLocale(locale);
		}
	}, [locale]);

	return <Outlet />;
}
