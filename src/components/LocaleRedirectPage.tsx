import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import {
	buildLocalizedPath,
	getPreferredLocale,
	persistPreferredLocale,
} from "#/lib/i18n/locales";
import { useTranslation } from "#/lib/i18n/provider";

type LocaleRedirectPageProps = {
	targetPath?: string;
};

export default function LocaleRedirectPage({
	targetPath,
}: LocaleRedirectPageProps) {
	const navigate = useNavigate();
	const location = useRouterState({
		select: (state) => state.location,
	});
	const { t } = useTranslation();

	useEffect(() => {
		const locale = getPreferredLocale();
		persistPreferredLocale(locale);

		void navigate({
			href: `${buildLocalizedPath(targetPath ?? location.pathname, locale)}${location.searchStr}${location.hash}`,
			replace: true,
		});
	}, [
		location.hash,
		location.pathname,
		location.searchStr,
		navigate,
		targetPath,
	]);

	return (
		<main className="page-wrap px-4 py-12">
			<section className="island-shell setup-note rounded-[2rem] px-6 py-10 text-center sm:px-8">
				<p className="island-kicker mb-2">{t("rootRedirect.kicker")}</p>
				<h1 className="display-title m-0 text-4xl text-[var(--sea-ink)] sm:text-5xl">
					{t("rootRedirect.title")}
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-[var(--sea-ink-soft)]">
					{t("rootRedirect.description")}
				</p>
			</section>
		</main>
	);
}
